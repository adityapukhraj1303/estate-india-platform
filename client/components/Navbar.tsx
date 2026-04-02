'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Search, Menu, X, UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 15 }} className="bg-gradient-to-tr from-gold-400 to-gold-600 p-2 rounded-xl text-navy-900">
              <Building2 className="w-6 h-6" />
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight text-black dark:text-white transition-colors duration-300">
              Estate<span className="text-gold-500">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-gold-500 transition-colors">Buy</Link>
            <Link href="/properties?listingType=rent" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-gold-500 transition-colors">Rent</Link>
            <Link href="/ai-insights" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-gold-500 transition-colors">AI Insights</Link>
            <Link href="/add-property" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-gold-500 transition-colors">List Property</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-gold-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
            
            {user ? (
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-navy-900/50 border border-navy-100 dark:border-navy-800 transition-all">
                     <div className="w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center text-[10px] font-black text-navy-900">
                        {user.name.charAt(0)}
                     </div>
                     <span className="text-xs font-bold text-navy-900 dark:text-white capitalize">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
               </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold hover:text-gold-500 transition-colors text-black dark:text-white">
                <UserCircle2 className="w-5 h-5" />
                <span>Log in</span>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-600 dark:text-slate-300">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden glass-nav absolute w-full top-full left-0 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/properties" className="font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Buy</Link>
            <Link href="/properties?listingType=rent" className="font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Rent</Link>
            <Link href="/ai-insights" className="font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">AI Insights</Link>
            {user ? (
              <button onClick={logout} className="font-bold px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-center flex items-center justify-center gap-2">
                 <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link href="/login" className="font-medium px-4 py-2 bg-navy-600 text-white rounded-lg text-center">Log in</Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
