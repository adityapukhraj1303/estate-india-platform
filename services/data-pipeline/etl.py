import pymongo
import json
import os
import random
from typing import List, Dict
from datetime import datetime

# Central configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "estate-india"
COLLECTION_NAME = "properties"

def generate_fde_mock_data() -> List[Dict]:
    """
    Generates high-quality, real-world mock data for property listings.
    These contain rich descriptions for the AI Engine's NLP/FAISS indexing.
    """
    cities = ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"]
    property_types = ["Apartment", "Villa", "Penthouse", "Studio"]
    
    properties = [
        {
            "title": "Luxury 3BHK Apartment in Koramangala",
            "description": "Stunning 3BHK apartment in the heart of Bangalore's tech hub. Features smart home integration, Italian marble flooring, and an unobstructed view of the city skyline. Perfect for tech executives looking for a premium lifestyle near the metro station.",
            "price": 25000000,
            "city": "Bangalore",
            "location": "Koramangala",
            "bedrooms": 3,
            "bathrooms": 3,
            "areaSqFt": 2200,
            "propertyType": "Apartment",
            "amenities": ["Swimming Pool", "Gym", "Smart Home", "Metro Access"],
            "images": ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
            "status": "Available",
            "isPremium": True,
            "createdAt": datetime.now()
        },
        {
            "title": "Modern 2BHK Near Indiranagar Metro",
            "description": "A well-lit, fully furnished 2BHK apartment located just 5 minutes from the Indiranagar metro station. Ideal for young professionals. Includes a dedicated coworking space and high-speed fiber internet.",
            "price": 12000000,
            "city": "Bangalore",
            "location": "Indiranagar",
            "bedrooms": 2,
            "bathrooms": 2,
            "areaSqFt": 1100,
            "propertyType": "Apartment",
            "amenities": ["Coworking Space", "Gym", "Metro Access"],
            "images": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
            "status": "Available",
            "isPremium": False,
            "createdAt": datetime.now()
        },
        {
            "title": "Sea-facing Penthouse in Worli",
            "description": "Ultra-luxury 4BHK penthouse offering a spectacular 180-degree view of the Arabian Sea. Private elevator access, infinity plunge pool, and automated climate control. The pinnacle of Mumbai luxury real estate.",
            "price": 150000000,
            "city": "Mumbai",
            "location": "Worli",
            "bedrooms": 4,
            "bathrooms": 5,
            "areaSqFt": 4500,
            "propertyType": "Penthouse",
            "amenities": ["Private Pool", "Sea View", "Home Theater", "Smart Home"],
            "images": ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
            "status": "Available",
            "isPremium": True,
            "createdAt": datetime.now()
        }
    ]
    return properties

def run_pipeline():
    print(f"🔗 Connecting to MongoDB at {MONGO_URI}...")
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # In a real FDE scenario, we process delta updates.
        # For simplicity, we will append these unless title exists.
        data = generate_fde_mock_data()
        
        inserted_count = 0
        for item in data:
            # Upsert based on title
            result = collection.update_one(
                {"title": item["title"]},
                {"$set": item},
                upsert=True
            )
            if result.upserted_id:
                inserted_count += 1
                
        print(f"✅ ETL Pipeline completed. Upserted {inserted_count} new properties out of {len(data)} processed.")
    except Exception as e:
        print(f"❌ ETL Pipeline Failed: {e}")

if __name__ == "__main__":
    run_pipeline()
