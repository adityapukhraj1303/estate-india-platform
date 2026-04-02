'use client';
import { useState, useRef, useEffect } from 'react';
import { Video, Mic, Smartphone, MessageSquare, User, Info, Wifi, Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualShowroom() {
  const [activeCall, setActiveCall] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome to the Lodha World Tower virtual tour. I'm your AI guide. You can ask me anything about the floor plans, amenities, or view!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Standby');

  const HEYGEN_API_KEY = "sk_V2_hgu_kPGFUjrUrLD_MvnKHGnAJDIgtdkQtnJng8TNAXDmyI5x";

  const handleStartTour = () => {
    setLoading(true);
    setConnectionStatus('Initializing AI Sync...');
    setTimeout(() => {
      setActiveCall(true);
      setConnectionStatus('Active Live Link');
      setLoading(false);
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "Great question! This unit is north-facing with a 12ft floor-to-ceiling height. We have only 2 such units left on the 45th floor. Would you like to schedule a site visit?" }]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[750px] relative">
          
          {/* AI Showroom Video Feed */}
          <div className="lg:col-span-2 relative bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
             {/* Actual background video placeholder */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80')] bg-cover opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-10000"></div>

             {/* UI Overlay */}
             <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full font-bold text-xs">
                <div className={`w-2 h-2 rounded-full ${activeCall ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                {activeCall ? 'LIVE AI SHOWROOM' : 'AI STANDBY'}
             </div>
             <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
                <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white/60"><Wifi className="w-4 h-4" /></div>
                <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white/60"><Mic className="w-4 h-4" /></div>
             </div>

             {/* Bottom Controls */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6">
                 <button className="p-5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                   <Video className="w-6 h-6" />
                 </button>
                 <button 
                  onClick={() => activeCall ? setActiveCall(false) : handleStartTour()}
                  disabled={loading}
                  className={`px-8 py-5 rounded-full font-bold shadow-2xl transition-all flex items-center gap-3 ${activeCall ? 'bg-red-500 text-white animate-pulse' : 'bg-gold-500 text-navy-900 opacity-100 hover:scale-105'}`}
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin"></div>
                   ) : activeCall ? <X className="w-6 h-6"/> : <Smartphone className="w-6 h-6"/>}
                   {loading ? 'Connecting...' : activeCall ? 'End AI Tour' : 'Start AI Video Tour'}
                 </button>
             </div>

             <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* AI Guide Chat / Brain */}
          <div className="flex flex-col h-[750px] space-y-4">
             <div className="flex-1 glass-card bg-slate-900/40 border border-white/10 p-6 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-xl text-navy-900 animate-pulse">
                         <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-bold text-black dark:text-white">EstateAI Guide</h3>
                         <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Voice Sync</p>
                      </div>
                   </div>
                   <div className="p-2 bg-white/5 rounded-xl text-white/40 cursor-help"><Info className="w-4 h-4"/></div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 px-2 custom-scrollbar">
                   {messages.map((m, i) => (
                     <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                       <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                         m.role === 'user' 
                         ? 'bg-navy-600 text-white rounded-tr-none' 
                         : 'bg-white/10 dark:bg-white/5 border border-white/10 rounded-tl-none text-black dark:text-slate-300'
                       }`}>
                         {m.content}
                       </div>
                     </motion.div>
                   ))}
                   {loading && (
                     <div className="flex justify-start">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-3xl rounded-tl-none flex gap-1">
                           <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
                           <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                           <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                     </div>
                   )}
                </div>

                <form onSubmit={handleSend} className="mt-6 flex gap-3 p-2 bg-white/5 rounded-2xl border border-white/10">
                   <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Guide anything..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-black dark:text-white placeholder:text-slate-400"
                   />
                   <button 
                    type="submit"
                    disabled={loading}
                    className="p-3 bg-gold-400 text-navy-950 font-bold rounded-xl shadow-xl shadow-gold-400/10"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                </form>
             </div>

             <div className="p-6 glass-card bg-gold-400/10 border border-gold-400/20 rounded-3xl text-center">
                <p className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-2">Guide Status</p>
                <h4 className="font-bold text-sm text-gold-500">{connectionStatus}</h4>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
