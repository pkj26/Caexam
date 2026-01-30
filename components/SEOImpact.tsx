import React from 'react';
import { Search, Zap } from 'lucide-react';

interface SEOImpactProps {
  onTopicClick: (topic: string) => void;
}

export const SEOImpact: React.FC<SEOImpactProps> = ({ onTopicClick }) => {
  const keywords = [
    "CA Final Audit MCQ", "Inter Law Notes", "Foundation Stats", "AIR 1 Strategy", 
    "ICAI New Scheme 2024", "GST Revision", "Costing Formulae", "Tax Amendments",
    "Direct Tax Summary", "SFM Best Questions"
  ];

  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          
          {/* Content side */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
              <Zap size={12} className="animate-pulse" /> Ranked #1 in Search
            </div>
            
            <h2 className="text-2xl md:text-4xl font-display font-bold text-brand-dark leading-tight">
              Top Trending <span className="text-brand-orange">Keywords</span>
            </h2>
            
            <p className="text-base text-brand-dark/70 leading-relaxed">
              We optimize our content daily based on what CA students are searching for.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover'}}></div>
                 ))}
              </div>
              <div className="text-xs font-bold text-brand-dark">
                <span className="text-brand-primary">12k+ Students</span> searching now
              </div>
            </div>
          </div>

          {/* Visual side (The "SEO Keyboard" concept) */}
          <div className="flex-1 relative w-full">
            <div className="bg-brand-dark p-6 rounded-2xl shadow-xl relative z-10 border-4 border-slate-800">
              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                <div className="p-1.5 bg-brand-primary/20 rounded-lg">
                  <Search size={16} className="text-brand-primary" />
                </div>
                <div className="text-xs font-medium text-white/50">Explore Trending Topics</div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <button 
                    key={i}
                    onClick={() => onTopicClick(kw)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-brand-primary hover:text-white border border-white/10 rounded-full text-[10px] font-semibold text-brand-cream/80 transition-all duration-300 hover:scale-105"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};