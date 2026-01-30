import React, { useState } from 'react';
import { Search, BookOpen, GraduationCap, Award, ChevronRight, Zap, Target, Book, Lightbulb } from 'lucide-react';
import { ViewType } from '../App';

export const TOPICS = [
  // CA Final - FR
  { id: 'f1', name: "Ind AS 115 Revenue", level: "CA Final", subject: "Financial Reporting", desc: "The 5-Step model to recognize revenue from contracts.", complexity: "Advanced" },
  { id: 'f2', name: "Financial Instruments (Ind AS 109)", level: "CA Final", subject: "Financial Reporting", desc: "Amortized Cost, FVTPL, and FVTOCI logic explained.", complexity: "Advanced" },
  { id: 'f3', name: "Business Combinations (Ind AS 103)", level: "CA Final", subject: "Financial Reporting", desc: "Purchase Method and Acquisition Date accounting.", complexity: "Advanced" },
  
  // CA Final - AFM
  { id: 'f4', name: "Derivatives & Hedging", level: "CA Final", subject: "AFM", desc: "Using Futures, Options, and Swaps to manage risk.", complexity: "Advanced" },
  { id: 'f5', name: "Forex & International FM", level: "CA Final", subject: "AFM", desc: "Currency fluctuations, arbitrage, and exchange rates.", complexity: "Advanced" },
  { id: 'f6', name: "Portfolio Management", level: "CA Final", subject: "AFM", desc: "CAPM Model, Risk-Return trade-off, and Beta logic.", complexity: "Moderate" },

  // CA Final - Audit
  { id: 'f7', name: "Professional Ethics (Clauses)", level: "CA Final", subject: "Auditing & Ethics", desc: "Mastering the Schedules and Clauses of CA Act.", complexity: "Advanced" },
  { id: 'f8', name: "Digital Auditing (Automated Env)", level: "CA Final", subject: "Auditing & Ethics", desc: "How technology changes the way we audit accounts.", complexity: "Moderate" },

  // CA Final - DT
  { id: 'f9', name: "International Taxation (Transfer Pricing)", level: "CA Final", subject: "Direct Tax", desc: "Arm's Length Price (ALP) and DTAA logic.", complexity: "Advanced" },
  { id: 'f10', name: "Assessment Procedures", level: "CA Final", subject: "Direct Tax", desc: "Scrutiny, Best Judgment, and Re-assessment rules.", complexity: "Moderate" },

  // CA Final - IDT
  { id: 'f11', name: "Blocked Credits (GST Sec 17(5))", level: "CA Final", subject: "Indirect Tax", desc: "Negative list where Input Tax Credit is not available.", complexity: "Moderate" },
  { id: 'f12', name: "Customs Valuation", level: "CA Final", subject: "Indirect Tax", desc: "Calculating Assessable Value for imported goods.", complexity: "Moderate" },

  // CA Inter (Existing)
  { id: 'i1', name: "Consolidation of Financial Statements", level: "CA Inter", subject: "Advanced Accounting", desc: "Merging Parent and Subsidiary accounts made simple.", complexity: "Advanced" },
  { id: 'i7', name: "Input Tax Credit (ITC)", level: "CA Inter", subject: "Taxation", desc: "The soul of GST - How to claim credit on inputs.", complexity: "Moderate" },
  
  // CA Foundation (Existing)
  { id: 't14', name: "Time Value of Money", level: "CA Foundation", subject: "Quantitative Aptitude", desc: "Understanding Simple Interest, Compound Interest, and Annuity logic.", complexity: "Advanced" },
  { id: 't11', name: "Indian Contract Act (Offer & Acceptance)", level: "CA Foundation", subject: "Business Laws", desc: "The foundation of every legal agreement explained simply.", complexity: "Moderate" }
];

interface TopicLibraryProps {
  onNavigate: (view: ViewType, id?: string) => void;
}

export const TopicLibrary: React.FC<TopicLibraryProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const levels = ['All', 'CA Foundation', 'CA Inter', 'CA Final'];

  const filteredTopics = TOPICS.filter(t => 
    (filter === 'All' || t.level === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4">CA Encyclopedia</div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-6">Expert <span className="text-brand-primary">Insights</span></h1>
          <p className="text-brand-dark/60 text-lg max-w-2xl mx-auto">Complex CA Final & Inter concepts decoded by rankers with interactive visual aids.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fade-up">
           <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {levels.map(lvl => (
                <button key={lvl} onClick={() => setFilter(lvl)} className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === lvl ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-slate-400 hover:text-brand-primary'}`}>{lvl}</button>
              ))}
           </div>
           <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search CA Final/Inter topics..." className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 outline-none text-sm font-bold" value={search} onChange={e => setSearch(e.target.value)} />
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTopics.map((topic, idx) => (
             <div key={topic.id} onClick={() => onNavigate('topic-detail', topic.name)} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all cursor-pointer group animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${topic.level === 'CA Final' ? 'bg-brand-dark text-white' : topic.level === 'CA Inter' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-green-50 text-green-600'}`}>
                      {topic.level === 'CA Final' ? <Award size={24}/> : topic.level === 'CA Inter' ? <GraduationCap size={24}/> : <BookOpen size={24}/>}
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-300">{topic.complexity}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{topic.name}</h3>
                <p className="text-xs text-brand-dark/40 font-bold uppercase mb-4">{topic.subject}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-2">{topic.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary">Technical Analysis <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
             </div>
           ))}
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border-4 border-brand-cream shadow-xl flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0"><Lightbulb size={40} className="text-brand-orange animate-bounce-slow" /></div>
           <div>
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Technical Doubt?</h3>
              <p className="text-slate-500 max-w-xl">CA Final topics can be tricky. Join our Telegram for daily 'Masterclass' voice notes from AIR rankers.</p>
           </div>
           <button className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-sm hover:bg-brand-primary transition-all ml-auto">Join Telegram</button>
        </div>
      </div>
    </div>
  );
};