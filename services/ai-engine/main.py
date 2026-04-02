from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
import os
import json
from dotenv import load_dotenv

# Try to import ML libraries, handle gracefully if not installed yet
try:
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
    from pymongo import MongoClient
    ML_ENABLED = True
except ImportError:
    ML_ENABLED = False
    print("WARNING: ML libraries (sentence_transformers, faiss, numpy, pymongo) not found. Running in mock mode.")

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EstateAI - AI Engine",
    description="FDE-grade ML Engine for Natural Language Property Search and Recommendations.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Model (Lazy load to speed up dev server boot)
model = None
index = None
property_metadata = []

def get_model():
    global model
    if ML_ENABLED and model is None:
        print("Loading SentenceTransformer model...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model

# Models
class SearchQuery(BaseModel):
    query: str

class ParsedQuery(BaseModel):
    intent: str
    filters: dict
    original_query: str

class PropertySearchResult(BaseModel):
    id: str
    title: str
    similarity_score: float
    metadata: dict

@app.on_event("startup")
async def startup_event():
    # Initialize FAISS index
    global index, property_metadata
    if ML_ENABLED:
        try:
            # all-MiniLM-L6-v2 embedding dimension is 384
            index = faiss.IndexFlatL2(384)
            
            # Connect to MongoDB and fetch properties to index
            mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
            client = MongoClient(mongo_uri)
            # Ensure we use the 'estate-india' database
            db = client["estate-india"]
            cursor = db["properties"].find({})
            
            props = list(cursor)
            if props:
                print(f"Indexing {len(props)} properties from MongoDB...")
                model = get_model()
                
                descriptions = [p.get("description", p.get("title", "")) for p in props]
                embeddings = model.encode(descriptions)
                
                index.add(np.array(embeddings).astype('float32'))
                property_metadata = [
                    {"id": str(p["_id"]), "title": p["title"], "price": p.get("price"), "city": p.get("city")} 
                    for p in props
                ]
                print("FAISS index built successfully.")
            else:
                print("No properties found in MongoDB to index.")
        except Exception as e:
            print(f"Error during AI Engine startup: {e}")
            # Fallback to empty index
            index = faiss.IndexFlatL2(384)

@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "service": "ai-engine", 
        "ml_enabled": ML_ENABLED
    }

@app.post("/parse-query", response_model=ParsedQuery)
def parse_natural_language_query(request: SearchQuery):
    """
    Parses a natural language query into structured filters.
    Example: '2BHK in Bangalore under 50L near metro' -> {'bedrooms': 2, 'city': 'Bangalore', 'max_price': 5000000}
    """
    query_lower = request.query.lower()
    
    # Mock NLP Parser - In a full FDE implementation, this routes to an LLM chain or fine-tuned NER model.
    filters = {}
    
    # Simple heuristic extraction
    import re
    bhk_match = re.search(r'(\d+)\s*bhk', query_lower)
    if bhk_match:
        filters['bedrooms'] = int(bhk_match.group(1))
        
    price_match = re.search(r'under\s*(\d+)\s*l', query_lower)
    if price_match:
        filters['max_price'] = int(price_match.group(1)) * 100000
        
    if "bangalore" in query_lower or "bengaluru" in query_lower:
        filters["city"] = "Bangalore"
    elif "mumbai" in query_lower:
        filters["city"] = "Mumbai"
        
    return {
        "intent": "property_search", 
        "filters": filters, 
        "original_query": request.query
    }

@app.post("/search", response_model=List[PropertySearchResult])
def vector_search(request: SearchQuery):
    """
    Performs semantic search across property descriptions using FAISS.
    """
    if not ML_ENABLED:
        return [
            PropertySearchResult(
                id="mock-1",
                title="Mock 2BHK in Bangalore",
                similarity_score=0.95,
                metadata={"price": 4500000, "city": "Bangalore"}
            )
        ]
        
    try:
        model = get_model()
        query_vector = model.encode([request.query])
        
        if index.ntotal == 0:
            return []
            
        # Search the index
        distances, indices = index.search(np.array(query_vector), k=5)
        
        results = []
        for j, i in enumerate(indices[0]):
            if i != -1 and i < len(property_metadata):
                results.append(
                    PropertySearchResult(
                        id=str(i),
                        title=property_metadata[i].get("title", "Unknown"),
                        similarity_score=float(1.0 / (1.0 + distances[0][j])), # Convert L2 distance to fake similarity score
                        metadata=property_metadata[i]
                    )
                )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PredictionRequest(BaseModel):
    city: str
    locality: str
    area: int
    type: str
    bedrooms: int
    furnishing: str

@app.post("/api/predict-price")
def predict_property_price(request: PredictionRequest):
    """
    Mock Price Prediction Endpoint for the FDE Analytics Dashboard.
    Generates a realistic mock predicted price based on input heuristics.
    """
    # Base rate per sqft by city
    city_rates = {
        "mumbai": 25000,
        "bangalore": 12000,
        "delhi": 15000,
        "pune": 8000,
        "hyderabad": 9000
    }
    
    city_lower = request.city.lower()
    base_rate = city_rates.get(city_lower, 10000)
    
    # Locality multiplier
    locality_lower = request.locality.lower()
    multiplier = 1.0
    if "bandra" in locality_lower or "worli" in locality_lower or "koramangala" in locality_lower:
        multiplier = 2.0
    elif "indiranagar" in locality_lower or "whitefield" in locality_lower or "hitec" in locality_lower:
        multiplier = 1.5
        
    # Furnishing
    if request.furnishing == "furnished":
        multiplier += 0.2
        
    # Calculate price
    base_price = request.area * base_rate * multiplier
    
    # Add random variance for realism (±5%)
    import random
    variance = random.uniform(0.95, 1.05)
    final_price = base_price * variance
    
    return {
        "predicted_price": final_price,
        "confidence": random.uniform(0.85, 0.98),
        "factors": {
            "location_impact": "High (+20%)" if multiplier > 1.2 else "Moderate (+5%)",
            "size_factor": f"{request.area} sqft is premium for this area." if request.area > 1500 else "Standard size.",
            "type_premium": f"{request.type.title()} commands a higher resale value." if request.type == "villa" else "Standard appreciation."
        }
    }
