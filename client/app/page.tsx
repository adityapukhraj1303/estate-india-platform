'use client';
import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import Link from 'next/link';
import { MapPin, Layout, PieChart, Video, Bed, Bath, Maximize2, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Hardcoded featured templates — always visible even if DB is empty
const FEATURED_TEMPLATES = [
  {
    _id: 'tpl-1',
    title: 'Luxury Mediterranean Villa',
    type: 'villa',
    listingType: 'buy',
    price: 85000000,
    bedrooms: 5,
    bathrooms: 6,
    area: 4500,
    isFeatured: true,
    location: { city: 'Goa', locality: 'Anjuna' },
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    badge: '🌴 Goa Villa',
    badgeColor: 'bg-emerald-500',
    tag: '₹8.5 Cr',
    rating: 4.9,
  },
  {
    _id: 'tpl-2',
    title: 'Ultra-Modern Sea-View Penthouse',
    type: 'apartment',
    listingType: 'buy',
    price: 122000000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    isFeatured: true,
    location: { city: 'Mumbai', locality: 'Worli' },
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    badge: '🏙️ Mumbai Penthouse',
    badgeColor: 'bg-blue-500',
    tag: '₹12.2 Cr',
    rating: 4.8,
  },
  {
    _id: 'tpl-3',
    title: 'Grade-A Tech Park Office Space',
    type: 'commercial',
    listingType: 'buy',
    price: 150000000,
    bedrooms: 0,
    bathrooms: 10,
    area: 25000,
    isFeatured: true,
    location: { city: 'Bangalore', locality: 'Manyata Tech Park' },
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
    badge: '🏢 Bangalore Commercial',
    badgeColor: 'bg-navy-600',
    tag: '₹15 Cr',
    rating: 4.7,
  },
];

function FeaturedCard({ prop }: { prop: any }) {
  const isTemplate = prop._id?.startsWith('tpl-');
  const formatPrice = (p: number) =>
    p >= 10000000 ? `₹${(p / 10000000).toFixed(1)} Cr` : `₹${(p / 100000).toFixed(0)}L`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={prop.images?.[0] || `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80`}
          alt={prop.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {prop.badge && (
            <span className={`${prop.badgeColor || 'bg-navy-600'} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg`}>
              {prop.badge}
            </span>
          )}
          <span className={`${prop.listingType === 'rent' ? 'bg-gold-500' : 'bg-navy-700'} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
            {prop.listingType === 'rent' ? '🔑 Rent' : '🏷️ Sale'}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
          <span className="text-white text-[10px] font-bold">{prop.rating || '4.8'}</span>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <span className="text-2xl font-black text-white">{formatPrice(prop.price)}</span>
          {prop.listingType === 'rent' && <span className="text-white/70 text-xs ml-1">/mo</span>}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-base text-black dark:text-white mb-1 line-clamp-1">{prop.title}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
          <MapPin className="w-3 h-3" />
          <span>{prop.location?.locality}, {prop.location?.city}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          {prop.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {prop.bedrooms} BHK
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {prop.bathrooms} Bath
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            {prop.area?.toLocaleString()} sqft
          </span>
        </div>

        <Link
          href={isTemplate ? `/properties?listingType=${prop.listingType}` : `/properties/${prop._id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-xl text-sm transition-all"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5002/api/properties?isFeatured=true&limit=3');
        if (res.data.data?.length > 0) {
          setFeatured(res.data.data);
        } else {
          setFeatured(FEATURED_TEMPLATES);
        }
      } catch (err) {
        // fallback to templates if API fails
        setFeatured(FEATURED_TEMPLATES);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-1">
        <HeroSection />

        {/* AI Feature Hub */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-gold-500 mb-2">AI-Powered Tools</p>
            <h2 className="text-2xl font-bold text-black dark:text-white">The Smartest Way to Find Property</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/neighborhood-map', icon: <MapPin className="w-8 h-8" />, label: 'Neighborhood Map', color: 'text-navy-600' },
              { href: '/virtual-staging', icon: <Layout className="w-8 h-8" />, label: 'AI Staging', color: 'text-gold-500' },
              { href: '/loan-eligibility', icon: <PieChart className="w-8 h-8" />, label: 'Loan Finder', color: 'text-navy-600' },
              { href: '/virtual-showroom', icon: <Video className="w-8 h-8" />, label: 'AI Showroom', color: 'text-gold-500' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card p-6 text-center group hover:border-gold-500 hover:-translate-y-1 hover:shadow-xl transition-all border-navy-500/10 shadow-sm rounded-2xl"
              >
                <div className={`${item.color} mx-auto mb-3 group-hover:scale-110 transition-transform w-fit`}>{item.icon}</div>
                <h3 className="font-bold text-xs text-black dark:text-white uppercase tracking-widest">{item.label}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gold-500 mb-2">Handpicked for You</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient">Featured Properties</h2>
              <p className="text-slate-500 mt-2 max-w-md">Discover premium real estate opportunities tailored to your luxurious lifestyle.</p>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-navy-600 dark:text-gold-400 hover:underline shrink-0"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-3xl h-[420px] animate-pulse bg-slate-100 dark:bg-slate-800/50" />
              ))
            ) : (
              featured.map((prop) => (
                <FeaturedCard key={prop._id} prop={prop} />
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-600 hover:bg-navy-700 text-white font-bold rounded-2xl shadow-xl shadow-navy-600/20 transition-all"
            >
              Explore All Properties <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
