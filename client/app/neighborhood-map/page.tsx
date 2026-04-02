'use client';
import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, School, ShoppingBag, Train, TrendingUp, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 19.01,
  lng: 72.83
};

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

export default function NeighborhoodMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCrLk3TecqTxcl29XIblUxu_i2IvLUViB8"
  });

  const [activeProperty, setActiveProperty] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const mockHotspots = [
    { id: 1, name: 'Lodha World Tower', lat: 18.99, lng: 72.82, price: '₹12.5 Cr', city: 'Mumbai' },
    { id: 2, name: 'Birla Niyaara', lat: 19.01, lng: 72.83, price: '₹8.2 Cr', city: 'Mumbai' },
    { id: 3, name: 'Oberoi 360 West', lat: 19.00, lng: 72.825, price: '₹22 Cr', city: 'Mumbai' }
  ];

  const handlePredict = (prop: any) => {
    setActiveProperty(prop);
    setAnalysis({
      growth: '+14.2%',
      schools: ['Green Oaks Int.', 'Mumbai Public School'],
      malls: ['Phoenix Palladium', 'Atria Mall'],
      metro: 'Worli Station (Upcoming - 2025)',
      sentiment: 'Very High Bullish'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[750px]">
          
          {/* Google Map Implementation */}
          <div className="lg:col-span-2 relative bg-slate-200 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                options={{ styles: mapStyle as any, disableDefaultUI: true }}
              >
                {mockHotspots.map((p) => (
                  <Marker 
                    key={p.id}
                    position={{ lat: p.lat, lng: p.lng }}
                    onClick={() => handlePredict(p)}
                    icon={{
                       path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                       fillColor: "#1e3a8a", // Navy
                       fillOpacity: 1,
                       strokeWeight: 2,
                       strokeColor: "#eab308", // Gold
                       scale: 2,
                       anchor: new google.maps.Point(12, 22)
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <p className="font-bold flex items-center gap-2"><MapPin className="animate-bounce" /> Loading AI Map Layers...</p>
              </div>
            )}
            
            <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xs">
              <h1 className="font-bold text-xl mb-1 text-black dark:text-white">AI Appreciation Map 📍</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Tap on gold-bordered markers to predict 2025 growth impact.</p>
            </div>
          </div>

          {/* AI Analysis Side Panel */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeProperty ? (
                <motion.div 
                  key={activeProperty.id}
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 h-full border-navy-500/10 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-4 bg-navy-600 rounded-2xl text-white shadow-lg">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl text-black dark:text-white leading-tight">{activeProperty.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-gold-400 text-navy-950 px-2 py-0.5 rounded font-black uppercase tracking-tighter">AI High Value</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-navy-700/5 rounded-3xl border border-navy-500/10">
                           <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Growth Forecast</p>
                           <p className="text-3xl font-black text-navy-600 dark:text-gold-500">{analysis.growth}</p>
                        </div>
                        <div className="p-5 bg-navy-700/5 rounded-3xl border border-navy-500/10 text-center">
                           <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Confidence</p>
                           <div className="flex items-center justify-center gap-1 text-green-500 font-bold text-xl">
                              <Activity className="w-4 h-4" /> 94%
                           </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-colors">
                        <div className="p-2.5 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl text-navy-600"><School className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-black dark:text-white">Premium Schools</p>
                          <p className="text-xs text-slate-500 mt-0.5">{analysis.schools.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-colors">
                        <div className="p-2.5 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl text-navy-600"><ShoppingBag className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-black dark:text-white">Luxury Lifestyle</p>
                          <p className="text-xs text-slate-500 mt-0.5">{analysis.malls.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-colors">
                        <div className="p-2.5 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl text-gold-500"><Train className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-black dark:text-white">Infra Transformation</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{analysis.metro}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                     <button className="w-full bg-navy-700 text-white font-black py-4 rounded-2xl shadow-2xl hover:bg-navy-800 transition-all uppercase text-sm tracking-widest">
                        Download Sector Report
                     </button>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full space-y-4">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
                    <Info className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">Sector Analysis Ready</h3>
                    <p className="text-sm text-slate-400 mt-2 px-4 leading-relaxed">Select any navy marker on the map to begin the AI deep-dive into appreciation potential.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
