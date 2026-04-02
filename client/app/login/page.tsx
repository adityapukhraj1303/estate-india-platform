'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Login
    setTimeout(() => {
      login({ name: formData.name || 'Aditya Pukhraj', email: formData.email });
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md p-8 border-navy-500/10 shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-400/20 rounded-full text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              Secure Login Port
            </div>
            <h1 className="text-3xl font-display font-bold text-black dark:text-white">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-2">Access your AI-curated property portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-navy-600 transition-colors" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-navy-600 text-black dark:text-white"
                  placeholder="e.g. Aditya Pukhraj"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-navy-600 transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-navy-600 text-black dark:text-white"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-navy-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-navy-600 text-black dark:text-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-navy-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-navy-600/20 hover:bg-navy-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Log In to EstateAI
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account? <span className="text-navy-600 dark:text-gold-500 font-bold cursor-pointer hover:underline">Request Invitation</span>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
