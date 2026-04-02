'use client';
import Link from 'next/link';
import { Building2, Globe, Hash, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 group">
                 <div className="bg-gradient-to-tr from-gold-400 to-gold-600 p-2 rounded-xl text-navy-900">
                   <Building2 className="w-6 h-6" />
                 </div>
                 <span className="font-display font-bold text-2xl tracking-tight text-black dark:text-white transition-colors duration-300">
                   Estate<span className="text-gold-500">AI</span>
                 </span>
               </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-4">
              India's first AI-driven real estate platform. We make finding your dream home an intelligent, seamless experience.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-slate-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/properties?listingType=buy" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">Buy a Property</Link></li>
              <li><Link href="/properties?listingType=rent" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">Rent a Property</Link></li>
              <li><Link href="/ai-insights" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">AI Price Predictor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-gold-500 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-slate-900 dark:text-white">Newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get weekly market updates and AI insights directly to your inbox.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Your email address" 
                 className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-lg px-4 focus:outline-none focus:border-gold-500 text-sm"
               />
               <button className="bg-navy-600 hover:bg-navy-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                 Subscribe
               </button>
            </form>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500 mb-4 md:mb-0">
            © 2025 EstateAI India Labs. Built with <Heart className="w-3 h-3 inline text-red-500 mx-1"/> for the future.
          </p>
          <div className="flex space-x-4 text-slate-400">
            <a href="#" className="hover:text-gold-500 transition-colors"><Globe className="w-5 h-5"/></a>
            <a href="#" className="hover:text-gold-500 transition-colors"><Hash className="w-5 h-5"/></a>
            <a href="#" className="hover:text-gold-500 transition-colors"><Mail className="w-5 h-5"/></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
