'use client';
import { useState } from 'react';
import { Sparkles, Brain, Calculator, TrendingUp, Info } from 'lucide-react';
import axios from 'axios';

interface PredictionResult {
  predicted_price: number;
  confidence: number;
  factors: {
    location_impact: string;
    [key: string]: string;
  };
}

export default function AIInsightsPage() {
  const [predictionData, setPredictionData] = useState({
    city: 'Bangalore',
    locality: '',
    area: 1200,
    type: 'apartment',
    bedrooms: 2,
    furnishing: 'unfurnished'
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const LOCALITIES = [
    "Bandra", "Worli", "Juhu", "Andheri",
    "Koramangala", "Indiranagar", "Whitefield",
    "Gachibowli", "HITEC City", "Banjara Hills",
    "Hinjewadi", "Baner", "Kothrud"
  ];

  const handleLocalityChange = (val: string) => {
    setPredictionData({...predictionData, locality: val});
    if (val.length > 1) {
      const filtered = LOCALITIES.filter(l => l.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/predict-price', predictionData);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6 font-semibold text-gold-500 text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            AI Intelligence Lab
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">Precision Real Estate Forecasting</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Use our proprietary AI models to predict property prices, analyze market trends, and make data-driven investment decisions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Prediction Form */}
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-black dark:text-white">
              <TrendingUp className="w-6 h-6 text-navy-500" />
              AI Price Predictor
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70 text-black dark:text-white">City</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all text-black dark:text-white"
                  value={predictionData.city}
                  onChange={(e) => setPredictionData({...predictionData, city: e.target.value})}
                >
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                  <option>Delhi</option>
                  <option>Pune</option>
                  <option>Hyderabad</option>
                </select>
              </div>
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold opacity-70 text-black dark:text-white">Locality</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all text-black dark:text-white"
                  placeholder="e.g. Koramangala"
                  value={predictionData.locality}
                  onChange={(e) => handleLocalityChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => predictionData.locality && setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
                        onClick={() => {
                          setPredictionData({...predictionData, locality: s});
                          setShowSuggestions(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70 text-black dark:text-white">Area (sqft)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all text-black dark:text-white"
                  value={predictionData.area}
                  onChange={(e) => setPredictionData({...predictionData, area: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70 text-black dark:text-white">Type</label>
                <select 
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all text-black dark:text-white"
                   value={predictionData.type}
                   onChange={(e) => setPredictionData({...predictionData, type: e.target.value})}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">Independent House</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-gradient-to-r from-navy-500 to-navy-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-navy-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing Data...' : <><Sparkles className="w-5 h-5" /> Calculate Predicted Price</>}
            </button>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-8">
            {prediction ? (
              <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-navy-900 to-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[80px] -mr-32 -mt-32"></div>
                
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BadgeCheckIcon className="w-6 h-6 text-gold-500" />
                  Prediction Result
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-gold-500">₹{(prediction.predicted_price / 10000000).toFixed(2)} Cr</span>
                    <span className="text-slate-400 mb-2">Estimated Value</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Confidence Score</p>
                      <p className="text-xl font-bold">{(prediction.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Market Sentiment</p>
                      <p className="text-xl font-bold">Bullish</p>
                    </div>
                  </div>

                  <div className="bg-gold-500/10 rounded-2xl p-4 border border-gold-500/20">
                    <h4 className="text-sm font-bold text-gold-500 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      AI Insight Notes
                    </h4>
                    <p className="text-sm text-slate-300">Based on current market trends in {predictionData.city}, properties in this locality are seeing a {prediction.factors.location_impact} growth impact. Invest now for 3-year ROI.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <Brain className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white">Waiting for input</h3>
                <p className="text-slate-500">Fill out the form to generate AI-driven analytics and property valuations.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BadgeCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
