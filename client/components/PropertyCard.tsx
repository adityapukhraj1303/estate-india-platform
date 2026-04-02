import { MapPin, BedDouble, Square, Heart, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    city: string;
    locality: string;
    address: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
  listingType: 'buy' | 'rent';
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/10">
      
      <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-gold-500/20 text-white hover:text-gold-400 transition-colors">
        <Heart className="w-5 h-5" />
      </div>

      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-navy-600/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
        {property.listingType === 'buy' ? 'For Sale' : 'For Rent'}
      </div>

      <div className="h-56 overflow-hidden relative">
        <img 
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex flex-col justify-between" style={{ minHeight: '180px' }}>
        <div>
          <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">
            {property.title}
          </h3>
          <p className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
               <MapPin className="w-4 h-4 mr-1 text-gold-500" />
               {property.location.locality}, {property.location.city}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
          <div className="flex gap-4">
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(new CustomEvent('openAIAssistant', { 
                    detail: { message: `Hi! Can you calculate the EMI for ${property.title} priced at ₹${(property.price/10000000).toFixed(2)} Cr?` }
                  }));
                }}
                className="p-2 bg-gold-500/10 text-gold-600 rounded-lg hover:bg-gold-500 hover:text-white transition-all group/calc"
                title="Calculate EMI with AI"
             >
                <Calculator className="w-5 h-5" />
             </button>
          </div>

          <p className="text-xl font-bold text-navy-800 dark:text-gold-500">
             ₹{(property.price >= 10000000) 
               ? `${(property.price / 10000000).toFixed(2)} Cr` 
               : `${(property.price / 100000).toFixed(1)} Lakhs`}
          </p>
        </div>
      </div>
    </div>
  );
}
