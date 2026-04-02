'use client';
import { useState } from 'react';
import { Sparkles, Layout, Monitor, Ruler, CheckCircle2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualStaging() {
  const [style, setStyle] = useState('modern');
  const [staging, setStaging] = useState(false);
  const [activeImg, setActiveImg] = useState('/prop1.png');

  const handleStage = () => {
    setStaging(true);
    setTimeout(() => {
      setStaging(false);
      // Mock staged image change
      setActiveImg('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80');
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 h-full border-navy-500/10">
              <h1 className="font-bold text-2xl flex items-center gap-2 mb-6 text-black dark:text-white">
                <Layout className="w-6 h-6 text-gold-500" />
                AI Staging
              </h1>
              
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Design Style</label>
                <div className="flex flex-wrap gap-2">
                  {['modern', 'minimalist', 'royal', 'bohemian'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                        style === s ? 'bg-navy-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-3">
                   <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Room Type</span>
                    <span className="text-navy-500 font-bold">Living Room</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Complexity</span>
                    <span className="text-navy-500 font-bold">High Detail</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleStage}
                disabled={staging}
                className="w-full mt-8 bg-gold-500 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-gold-600 transition-all flex items-center justify-center gap-2"
              >
                {staging ? 'Generating Furniture...' : <><Wand2 className="w-5 h-5"/> Stage This Room</>}
              </button>
            </div>
          </div>

          {/* Staging Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative glass-card h-[600px] overflow-hidden group border-navy-500/10 shadow-2xl">
              <AnimatePresence>
                {staging && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white"
                  >
                    <div className="w-24 h-24 relative mb-6">
                       <div className="absolute inset-0 border-4 border-gold-500 rounded-full animate-ping opacity-20"></div>
                       <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-full border-t-4 border-gold-500 rounded-full"
                       />
                       <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-gold-500" />
                    </div>
                    <p className="font-bold text-2xl animate-pulse">AI is Virtually Staging...</p>
                    <p className="text-sm opacity-60 mt-2">Placing high-end {style} furniture by Indian designers.</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <img 
                src={activeImg} 
                alt="Room View" 
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                 <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-white/20">
                   {activeImg === '/prop1.png' ? 'Original Empty Room' : <span className="text-green-500 flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> AI Staged Result</span>}
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
               {['Living', 'Bedroom', 'Kitchen', 'Balcony'].map((room, i) => (
                 <div key={room} className={`h-24 rounded-2xl overflow-hidden glass-card relative cursor-pointer group ${i === 0 ? 'border-gold-500 border-2' : ''}`}>
                   <img src={`https://picsum.photos/seed/room${i}/200/200`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-widest">{room}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
