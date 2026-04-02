'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '../../components/PropertyCard';
import { Search, SlidersHorizontal, Sparkles, MapPin, TrendingUp, Building2, TreePine, Home, Landmark } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BUY_TEMPLATES = [
  {
    label: 'Villas in Goa',
    icon: '🌴',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    search: 'Goa',
    tag: 'Starting ₹8.5 Cr',
    badge: 'Trending',
  },
  {
    label: 'Luxury Flats Mumbai',
    icon: '🏙️',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    search: 'Mumbai',
    tag: 'Starting ₹4.2 Cr',
    badge: 'Hot',
  },
  {
    label: 'Tech Parks Bangalore',
    icon: '🏢',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    search: 'Bangalore',
    tag: 'Starting ₹50 Cr',
    badge: 'New',
  },
  {
    label: 'Penthouses Delhi',
    icon: '✨',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    search: 'Delhi',
    tag: 'Starting ₹12 Cr',
    badge: 'Premium',
  },
];

const RENT_TEMPLATES = [
  {
    label: 'Furnished Flats Bangalore',
    icon: '🛋️',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    search: 'Bangalore',
    tag: '₹25K – ₹80K/mo',
    badge: 'Most Popular',
  },
  {
    label: 'Sea-View Apartments Mumbai',
    icon: '🌊',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    search: 'Mumbai',
    tag: '₹80K – ₹3L/mo',
    badge: 'Luxury',
  },
  {
    label: 'Beach Villas Goa',
    icon: '🏖️',
    img: 'https://images.unsplash.com/photo-1599358139491-50df0da28ad6?w=600&q=80',
    search: 'Goa',
    tag: '₹1.5L – ₹5L/mo',
    badge: 'Trending',
  },
  {
    label: 'Office Spaces Hyderabad',
    icon: '💼',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    search: 'Hyderabad',
    tag: '₹50K – ₹5L/mo',
    badge: 'Commercial',
  },
];

const BADGE_COLORS: Record<string, string> = {
  'Trending': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Hot': 'bg-red-500/20 text-red-400 border-red-500/30',
  'New': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Premium': 'bg-gold-500/20 text-gold-500 border-gold-500/30',
  'Most Popular': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Luxury': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Commercial': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingType = searchParams.get('listingType') || 'buy';
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>(listingType as 'buy' | 'rent');
  const [aiSearchMode, setAiSearchMode] = useState(false);

  const templates = activeTab === 'buy' ? BUY_TEMPLATES : RENT_TEMPLATES;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        if (aiSearchMode && search.length > 3) {
            // Call FastAPI AI Engine for Semantic Search
            const res = await axios.post(`http://localhost:8000/search`, { query: search });
            setProperties(res.data.map((r: any) => ({
                _id: r.id,
                ...r.metadata
            })));
        } else {
            const res = await axios.get(`http://localhost:5002/api/properties?listingType=${activeTab}&search=${search}&limit=100`);
            setProperties(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeTab, search, aiSearchMode]);

  const handleTemplateClick = (templateSearch: string) => {
    setSearch(templateSearch);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-1 pt-28 pb-20 w-full">

        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
            {activeTab === 'buy' ? '🏡 Buy Your Dream Home' : '🔑 Find the Perfect Rental'}
          </h1>
          <p className="text-slate-500 font-medium">India's #1 AI-powered real estate platform</p>
        </div>

        {/* Tab Switcher + Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Buy / Rent Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 gap-1">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'buy'
                    ? 'bg-navy-600 text-white shadow-lg shadow-navy-600/30'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                🏷️ Buy
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'rent'
                    ? 'bg-navy-600 text-white shadow-lg shadow-navy-600/30'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                🔑 Rent
              </button>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-96">
              <div className="glass-effect p-1.5 rounded-2xl flex items-center bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 flex items-center px-3 py-1.5">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search city, locality, type..."
                    className="bg-transparent border-none focus:outline-none text-sm w-full text-black dark:text-white placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setAiSearchMode(!aiSearchMode)}
                  className={`p-2 rounded-xl transition-all flex items-center gap-2 ${
                    aiSearchMode 
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                  title="Toggle AI Semantic Search"
                >
                  <Sparkles className={`w-4 h-4 ${aiSearchMode ? 'animate-pulse' : ''}`} />
                  {aiSearchMode && <span className="text-[10px] font-black uppercase">AI Mode</span>}
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Templates */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">
              {activeTab === 'buy' ? '🔥 Top Properties to Buy' : '⭐ Featured Rentals'}
            </h2>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Quick Browse</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((t, i) => (
              <motion.button
                key={t.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleTemplateClick(t.search)}
                className={`relative overflow-hidden rounded-2xl text-left group border-2 transition-all ${
                  search === t.search
                    ? 'border-gold-500 shadow-lg shadow-gold-500/20'
                    : 'border-transparent hover:border-navy-500/50'
                }`}
              >
                <img
                  src={t.img}
                  alt={t.label}
                  className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge */}
                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${BADGE_COLORS[t.badge] || ''}`}>
                  {t.badge}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-base mb-0.5">{t.icon}</p>
                  <p className="font-bold text-white text-xs leading-tight">{t.label}</p>
                  <p className="text-[10px] text-gold-400 font-bold mt-0.5">{t.tag}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Filter Indicator */}
        {search && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Showing results for:</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-navy-600/10 border border-navy-600/20 rounded-full text-navy-600 dark:text-gold-400 text-xs font-bold">
                <MapPin className="w-3 h-3" />
                {search}
                <button onClick={() => setSearch('')} className="ml-1 hover:text-red-500 transition-colors">×</button>
              </span>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 h-80 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-card rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">No Properties Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Try adjusting your filters or search term to see more results.</p>
              <button
                onClick={() => window.dispatchEvent(new Event('openAIAssistant'))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-600 dark:text-gold-400 text-sm font-bold hover:bg-gold-400/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Ask our AI Assistant for help finding a property!
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
