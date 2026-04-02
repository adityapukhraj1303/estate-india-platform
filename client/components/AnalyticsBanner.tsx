import { Activity, Clock, BadgeCheck, TrendingUp } from 'lucide-react';

export default function AnalyticsBanner() {
  const stats = [
    { icon: <Activity />, value: "24,000+", label: "Active Listings" },
    { icon: <Clock />, value: "5 Mins", label: "Average Response Time" },
    { icon: <BadgeCheck />, value: "100%", label: "Verified Properties" },
    { icon: <TrendingUp />, value: "92%", label: "Price Prediction Accuracy" },
  ];

  return (
    <div className="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center space-y-2 group">
              <div className="p-3 bg-navy-50 dark:bg-slate-800 rounded-2xl text-navy-600 dark:text-gold-400 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-display font-bold text-slate-800 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
