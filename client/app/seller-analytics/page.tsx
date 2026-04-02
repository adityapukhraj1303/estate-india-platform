import { Sparkles, TrendingUp, Users, Activity, Eye, ArrowUpRight } from 'lucide-react';
import React from 'react';

// Use Incremental Static Regeneration (ISR) - Refetch this page in the background every 60 seconds
export const revalidate = 60;

async function getSellerAnalytics() {
  // Simulate fetching analytics from backend
  // In a real FDE deployment, this queries the PostgreSQL warehouse or Redis cache
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalViews: 12450,
    activeLeads: 34,
    conversionRate: '2.8%',
    predictedTimeToSell: '14 Days',
    revenueForecast: '₹4.5 Cr',
    popularLocations: ['Koramangala', 'Indiranagar', 'Whitefield']
  };
}

export default async function SellerAnalyticsPage() {
  const analytics = await getSellerAnalytics();

  return (
    <div className="min-h-screen bg-[var(--background)] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">
              Seller Analytics Dashboard
            </h1>
            <p className="text-slate-500 font-medium tracking-wide">
              FDE-Grade Insights & Predictive ML Modelling
            </p>
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            ISR Activated (Real-time Sync)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-white/60 to-white/10 dark:from-slate-900/60 dark:to-slate-900/10 border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-gold-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Eye className="w-16 h-16" /></div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Property Views (7d)</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{analytics.totalViews.toLocaleString()}</h3>
            <div className="flex items-center text-green-500 text-sm font-bold gap-1">
              <ArrowUpRight className="w-4 h-4" /> +14.5% vs last week
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-white/60 to-white/10 dark:from-slate-900/60 dark:to-slate-900/10 border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-gold-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-16 h-16" /></div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Active Leads</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{analytics.activeLeads}</h3>
            <div className="flex items-center text-green-500 text-sm font-bold gap-1">
              <ArrowUpRight className="w-4 h-4" /> High buyer intent detected
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-white/60 to-white/10 dark:from-slate-900/60 dark:to-slate-900/10 border border-gold-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold-500/5" />
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-gold-500"><Sparkles className="w-16 h-16" /></div>
            <p className="text-gold-600 dark:text-gold-400 text-sm font-bold uppercase tracking-widest mb-1">AI Prediction: Time to Sell</p>
            <h3 className="text-4xl font-black text-gold-600 dark:text-gold-400 mb-2">{analytics.predictedTimeToSell}</h3>
            <div className="flex items-center text-gold-600/80 dark:text-gold-400/80 text-sm font-bold gap-1">
              Based on local demand vectors
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
