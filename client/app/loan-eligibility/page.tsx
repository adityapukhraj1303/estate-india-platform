'use client';
import { useState } from 'react';
import { Building2, User, Landmark, IndianRupee, PieChart, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoanEligibility() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult({
        limit: '₹5.2 Cr',
        banks: [
          { name: 'HDFC Bank', rate: '8.4%', approval: 'Instant' },
          { name: 'ICICI Bank', rate: '8.65%', approval: '48 Hours' },
          { name: 'SBI', rate: '8.3%', approval: '7 Days' }
        ]
      });
      setStep(3);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 mb-4 font-bold text-gold-600 text-[10px] uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Gemini Loan Engine
          </div>
          <h1 className="text-4xl font-display font-bold text-black dark:text-white mb-2">Check Loan Eligibility</h1>
          <p className="text-slate-500">Fast-track your home loan application with AI pre-verification.</p>
        </div>

        <div className="glass-card p-12 border-navy-500/10 relative overflow-hidden bg-white/20 dark:bg-slate-900/10 backdrop-blur-3xl shadow-2xl">
          {/* Progress Tracker */}
          <div className="flex justify-between mb-16 relative px-8">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  step >= s ? 'bg-navy-600 text-white shadow-xl scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5"/> : s}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                 <h2 className="text-2xl font-bold flex items-center gap-3 text-black dark:text-white">
                  <User className="w-6 h-6 text-gold-500" />
                  Personal Information
                 </h2>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Monthly Salary (INR)</label>
                       <input type="number" placeholder="5,00,000" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-navy-600 text-black dark:text-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Current EMIs (INR)</label>
                       <input type="number" placeholder="50,000" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-navy-600 text-black dark:text-white" />
                    </div>
                 </div>
                 <button onClick={() => setStep(2)} className="w-full bg-navy-600 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-navy-700 transition-all">
                  Next: Financial History
                 </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 text-center p-8">
                 <div className="w-24 h-24 mx-auto relative mb-6">
                   <div className="absolute inset-0 border-4 border-gold-400 rounded-full animate-ping opacity-10"></div>
                   <div className="absolute inset-0 border-4 border-navy-500 rounded-full border-t-transparent animate-spin"></div>
                   <PieChart className="absolute inset-0 m-auto w-10 h-10 text-navy-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-black dark:text-white">Analyzing Financial Profiles</h2>
                 <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-sm font-medium leading-relaxed mt-2">
                    Our **Gemini AI engine** is currently cross-referencing your profile with high-approval criteria from **HDFC**, **ICICI**, and **SBI** to find your maximum eligibility limit.
                 </p>
                 <button 
                  onClick={handleCalculate} 
                  disabled={loading} 
                  className="mt-8 px-12 bg-navy-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-navy-500/30 hover:bg-navy-700 transition-all uppercase text-sm tracking-widest flex items-center gap-3 mx-auto"
                 >
                   {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing AI Report...
                    </>
                   ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      Finalize AI Risk Report
                    </>
                   )}
                 </button>
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                 <div className="p-8 bg-gradient-to-br from-navy-800 to-slate-900 rounded-3xl text-white text-center shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-3xl -mr-16 -mt-16"></div>
                    <p className="text-sm font-bold opacity-60 uppercase mb-2">Estimated Loan Limit</p>
                    <p className="text-6xl font-black text-gold-500 mb-6">{result.limit}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold">
                       <CheckCircle2 className="w-4 h-4" /> Eligible for Instant Approval
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Top Bank Offers</p>
                    {result.banks.map((bank: any) => (
                      <div key={bank.name} className="flex items-center justify-between p-4 glass-card bg-white dark:bg-slate-800 border-navy-500/5 hover:border-navy-500 transition-all cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-navy-600"><Landmark className="w-5 h-5"/></div>
                            <div>
                               <p className="font-bold text-sm text-black dark:text-white">{bank.name}</p>
                               <p className="text-[10px] text-slate-500 uppercase tracking-widest">Starts at {bank.rate}</p>
                            </div>
                         </div>
                         <button className="px-4 py-2 bg-navy-600 text-white text-xs font-bold rounded-lg hover:bg-navy-700 transition-all">Apply Now</button>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
