import React from 'react';
import { ShieldCheck, RefreshCcw, Clock, Award, ShieldAlert, CheckCircle } from 'lucide-react';

export const GuaranteeSection: React.FC = () => {
  const guarantees = [
    {
      icon: Clock,
      title: "48-Hour Delay Refund",
      desc: "If evaluation exceeds 48 hours, we refund the cost of that specific test immediately.",
      badge: "Time Guarantee"
    },
    {
      icon: Award,
      title: "Quality or Refund",
      desc: "If you prove evaluation wasn't by a CA, we refund your entire course fee.",
      badge: "Expert Guarantee"
    },
    {
      icon: RefreshCcw,
      title: "7-Day Peace of Mind",
      desc: "Not satisfied with first 2 tests? Request a full refund within 7 days.",
      badge: "Satisfaction Guarantee"
    }
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side: Trust Badge Visual */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ShieldAlert size={14} /> 100% Risk-Free
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark leading-tight mb-6">
              Our <span className="text-brand-primary">Iron-Clad</span> <br/>
              Money Back Guarantee
            </h2>
            
            <p className="text-base text-brand-dark/70 mb-8 leading-relaxed max-w-xl">
              We don't just sell test series; we sell results. If we fail to meet our high standards, your investment is safe.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl font-display font-black text-brand-primary">100%</span>
                <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Refund Rate</span>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl font-display font-black text-brand-primary">48h</span>
                <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Strict TAT</span>
              </div>
            </div>
          </div>

          {/* Right Side: Guarantee Cards */}
          <div className="flex-1 grid gap-4 w-full">
            {guarantees.map((item, index) => (
              <div 
                key={index} 
                className="group p-5 bg-brand-cream border border-brand-primary/10 rounded-2xl hover:bg-white hover:shadow-lg hover:border-brand-primary/30 transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-brand-dark">{item.title}</h3>
                      <span className="text-[9px] font-black text-brand-orange uppercase bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/10">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-brand-dark/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Confidence Stamp */}
        <div className="mt-12 p-6 rounded-3xl bg-brand-dark text-white flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white shadow-xl overflow-hidden relative">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
               <ShieldCheck size={24} className="text-white" />
             </div>
             <div>
               <h4 className="text-lg font-display font-bold">Still Skeptical?</h4>
               <p className="text-brand-cream/60 text-xs mt-0.5">Talk to our founder directly about our quality commitment.</p>
             </div>
           </div>
           <button className="px-6 py-2.5 bg-white text-brand-dark rounded-xl font-black text-xs hover:bg-brand-orange hover:text-white transition-all shadow-lg">
             Schedule Founder Call
           </button>
        </div>
      </div>
    </section>
  );
};