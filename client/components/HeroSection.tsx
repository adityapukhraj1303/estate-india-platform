'use client';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Home, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    // In real app, we would hit the AI parser endpoint here and then route
    // /api/parse-query -> then to /properties?filters=...
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/properties?search=${encodeURIComponent(query)}`);
    }, 1200);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-navy-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/10 blur-[120px]" />
      </div>

      {/* Decorative Images/Elements */}
      <div className="absolute right-0 bottom-0 opacity-10 dark:opacity-[0.03] pointer-events-none w-1/2 h-full z-0">
         <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Mansion BG" className="object-cover w-full h-full" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-12 md:mt-24 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left md:max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-8 border-gold-400/30">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">AI-Powered Real Estate</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-[1.1]">
            Find Your <span className="text-gradient">Dream Home</span> <br className="hidden md:block"/> With AI Precision
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
            Type exactly what you're looking for in natural language. Our smart AI analyzes thousands of properties across India instantly.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <form onSubmit={handleAISearch} className="glass-effect p-2 rounded-2xl flex flex-col sm:flex-row gap-2 relative z-20 shadow-2xl">
              <div className="relative flex-1 flex items-center px-4 py-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try '2BHK in Bangalore under 50 Lakhs...'" 
                  className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-gradient-to-r from-navy-500 to-navy-600 hover:from-navy-600 hover:to-navy-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-navy-500/25 disabled:opacity-70"
              >
                {isSearching ? (
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : (
                  <>Search <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
            
            <div className="mt-4 flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500 font-medium justify-center md:justify-start">
              <span>Popular:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-gold-500/50 hover:text-gold-500 cursor-pointer transition-colors bg-white/50 dark:bg-black/20">Villas in Goa</span>
                <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-gold-500/50 hover:text-gold-500 cursor-pointer transition-colors bg-white/50 dark:bg-black/20">Flats in Mumbai</span>
                <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-gold-500/50 hover:text-gold-500 cursor-pointer transition-colors bg-white/50 dark:bg-black/20">Tech Parks Bangalore</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
