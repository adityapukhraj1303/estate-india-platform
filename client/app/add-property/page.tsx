'use client';
import { useState } from 'react';
import { Upload, Home, MapPin, IndianRupee, Image as ImageIcon, CheckCircle2, Sparkles, Building2, TreePine } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  {
    id: 'goa-villa',
    name: 'Goa Villa',
    icon: '🌴',
    label: 'For Sale',
    sublabel: 'Anjuna, Goa',
    previewImg: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    data: {
      title: 'Luxury Sea-Facing Mediterranean Villa',
      listingType: 'buy',
      type: 'villa',
      price: '85000000',
      area: '4500',
      bedrooms: 5,
      bathrooms: 6,
      city: 'Goa',
      locality: 'Anjuna',
      address: 'Villa No. 12, Anjuna Beach Road, North Goa',
    }
  },
  {
    id: 'mumbai-flat',
    name: 'Mumbai Flat',
    icon: '🏙️',
    label: 'For Rent',
    sublabel: 'Worli, Mumbai',
    previewImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    data: {
      title: 'Ultra-Modern Sea-View Skyline Apartment',
      listingType: 'rent',
      type: 'apartment',
      price: '250000',
      area: '1800',
      bedrooms: 3,
      bathrooms: 3,
      city: 'Mumbai',
      locality: 'Worli',
      address: 'Tower B, Sea Face Heights, Worli Sea Face, Mumbai',
    }
  },
  {
    id: 'bangalore-tech',
    name: 'Tech Park BLR',
    icon: '🏢',
    label: 'For Sale',
    sublabel: 'Manyata, Bangalore',
    previewImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    data: {
      title: 'Grade-A Commercial Tech Park Office Space',
      listingType: 'buy',
      type: 'commercial',
      price: '150000000',
      area: '25000',
      bedrooms: 0,
      bathrooms: 10,
      city: 'Bangalore',
      locality: 'Manyata Tech Park',
      address: 'Block C-4, Manyata Embassy Business Park, Hebbal, Bangalore',
    }
  },
];

export default function AddPropertyPage() {
  const [step, setStep] = useState(1);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: 'buy',
    type: 'apartment',
    price: '',
    area: '',
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: '',
      city: 'Bangalore',
      locality: '',
      zipcode: ''
    },
    amenities: [] as string[]
  });

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setActiveTemplate(template.id);
    setFormData({
      ...formData,
      title: template.data.title,
      listingType: template.data.listingType,
      type: template.data.type,
      price: template.data.price,
      area: template.data.area,
      bedrooms: template.data.bedrooms,
      bathrooms: template.data.bathrooms,
      location: {
        ...formData.location,
        city: template.data.city,
        locality: template.data.locality,
        address: template.data.address,
      }
    });
    toast.success(`✅ ${template.name} template applied!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5002/api/properties', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Property listed successfully!');
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to list property. Ensure you are logged in.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-1 pt-32 pb-20 max-w-5xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 mb-4 font-bold text-gold-600 text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            EstateAI Listing Portal
          </div>
          <h1 className="text-4xl font-display font-bold text-black dark:text-white">List Your Property</h1>
          <p className="text-slate-500 mt-2">Use AI-powered templates or fill in manually</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 mb-10 px-4">
          {[
            { n: 1, label: 'Details' },
            { n: 2, label: 'Location' },
            { n: 3, label: 'Done' }
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                step >= s.n ? 'bg-navy-600 text-white shadow-lg shadow-navy-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= s.n ? 'text-navy-600 dark:text-gold-400' : 'text-slate-400'}`}>{s.label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-navy-600' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Info + Templates */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-8"
            >
              {/* Quick Templates */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                    Quick Start Templates
                  </h2>
                  <p className="text-sm text-slate-400">Click any template to instantly pre-fill the form</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => applyTemplate(t)}
                      className={`relative overflow-hidden rounded-2xl border-2 text-left transition-all group ${
                        activeTemplate === t.id
                          ? 'border-gold-500 shadow-xl shadow-gold-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-navy-500'
                      }`}
                    >
                      <img
                        src={t.previewImg}
                        alt={t.name}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {activeTemplate === t.id && (
                        <div className="absolute top-3 right-3 bg-gold-500 text-navy-950 rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-2xl mb-1">{t.icon}</p>
                        <p className="font-bold text-white text-sm">{t.name}</p>
                        <p className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mt-0.5">{t.label} · {t.sublabel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Fields */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                  <Home className="w-5 h-5 text-gold-500" />
                  Property Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Title</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none text-black dark:text-white"
                      placeholder="e.g. Luxury 3BHK Penthouse with Sea View"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Listing Type</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                      value={formData.listingType}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    >
                      <option value="buy">🏷️ For Sale</option>
                      <option value="rent">🔑 For Rent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Type</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="apartment">🏢 Apartment / Flat</option>
                      <option value="villa">🌴 Villa</option>
                      <option value="house">🏠 Independent House</option>
                      <option value="commercial">🏗️ Commercial / Tech Park</option>
                      <option value="plot">🗺️ Plot / Land</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Bedrooms</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n === 0 ? 'Studio / N/A' : `${n} BHK`}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Area (sq ft)</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                      placeholder="e.g. 1500"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-navy-600 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-navy-700 transition-all flex items-center justify-center gap-2"
                >
                  Next: Location & Price →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Location + Price + Image */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-8 space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                <MapPin className="w-5 h-5 text-gold-500" />
                Location & Financials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Price (INR)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                    placeholder="e.g. 8500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">City</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                  >
                    {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Goa', 'Kolkata', 'Ahmedabad'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Locality / Area</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                    placeholder="e.g. Koramangala, Worli, Anjuna"
                    value={formData.location.locality}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, locality: e.target.value } })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pin Code</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none text-black dark:text-white"
                    placeholder="e.g. 400018"
                    value={formData.location.zipcode}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, zipcode: e.target.value } })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Address</label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none min-h-[80px] text-black dark:text-white"
                    placeholder="Street, landmark, building name..."
                    value={formData.location.address}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                  />
                </div>

                {/* Image Upload Zone */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Property Images</label>
                  <div className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-gold-500 hover:text-gold-500 hover:bg-gold-50/30 dark:hover:bg-gold-900/10 transition-all cursor-pointer group">
                    <Upload className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold">Drag & Drop or Click to Upload</p>
                    <p className="text-xs mt-1 opacity-70">JPG, PNG, WEBP · Max 10MB per image</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 transition-all"
                >
                  🚀 Submit Property
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-16 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-xl">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white">Property Listed! 🎉</h2>
              <p className="text-slate-500 max-w-sm mx-auto">Your property is now live and being analyzed by our AI engine for optimal market placement.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/properties'}
                  className="bg-navy-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-navy-700 transition-all"
                >
                  View All Listings
                </button>
                <button
                  onClick={() => { setStep(1); setActiveTemplate(null); }}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Add Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
