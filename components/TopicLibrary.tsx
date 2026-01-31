import React, { useState } from 'react';
import { Search, BookOpen, GraduationCap, Award, ChevronRight, Zap, Target, Book, Lightbulb } from 'lucide-react';
import { ViewType } from '../App';

export const TOPICS = [
  // --- CA FINAL ---
  { id: 'f1', name: "Ind AS 115 Revenue", level: "CA Final", subject: "Financial Reporting", desc: "The 5-Step model to recognize revenue from contracts with customers.", complexity: "Advanced" },
  { id: 'f2', name: "Ind AS 116 Leases", level: "CA Final", subject: "Financial Reporting", desc: "Right-of-Use (ROU) asset and Lease Liability accounting logic.", complexity: "Advanced" },
  { id: 'f3', name: "Financial Instruments (Ind AS 109)", level: "CA Final", subject: "Financial Reporting", desc: "Amortized Cost, FVTPL, and FVTOCI explained simply.", complexity: "Advanced" },
  { id: 'f4', name: "Business Combinations & Consolidation", level: "CA Final", subject: "Financial Reporting", desc: "Ind AS 103 and 110: Merging complex group accounts.", complexity: "Advanced" },
  { id: 'f5', name: "Derivatives & Hedging", level: "CA Final", subject: "AFM", desc: "Using Futures, Options, and Swaps to manage financial risk.", complexity: "Advanced" },
  { id: 'f6', name: "Portfolio Management", level: "CA Final", subject: "AFM", desc: "Risk-Return trade-off, CAPM Model, and Beta analysis.", complexity: "Moderate" },
  { id: 'f7', name: "International Financial Mgmt & Forex", level: "CA Final", subject: "AFM", desc: "Currency fluctuations, Arbitrage, and Exchange rate logic.", complexity: "Advanced" },
  { id: 'f8', name: "Professional Ethics (Clauses)", level: "CA Final", subject: "Auditing & Ethics", desc: "Mastering the Schedules and Clauses of the CA Act 1949.", complexity: "Advanced" },
  { id: 'f9', name: "Standards on Auditing (SA 200-700)", level: "CA Final", subject: "Auditing & Ethics", desc: "Complete guide to Audit evidence, reporting, and quality control.", complexity: "Advanced" },
  { id: 'f10', name: "Digital Auditing", level: "CA Final", subject: "Auditing & Ethics", desc: "Auditing in an automated environment using modern CA tools.", complexity: "Moderate" },
  { id: 'f11', name: "International Taxation & Transfer Pricing", level: "CA Final", subject: "Direct Tax", desc: "Arm's Length Price (ALP) and DTAA concepts for MNCs.", complexity: "Advanced" },
  { id: 'f12', name: "Assessment Procedures", level: "CA Final", subject: "Direct Tax", desc: "Scrutiny, Best Judgment, and Re-assessment rules in DT.", complexity: "Moderate" },
  { id: 'f13', name: "ITC Restrictions & Blocked Credit", level: "CA Final", subject: "Indirect Tax", desc: "Section 17(5) - When you cannot claim GST credit.", complexity: "Moderate" },
  { id: 'f14', name: "Exemptions under GST", level: "CA Final", subject: "Indirect Tax", desc: "List of goods and services that are out of the tax net.", complexity: "Basic" },
  { id: 'f15', name: "Customs Valuation", level: "CA Final", subject: "Indirect Tax", desc: "Calculating Assessable Value for imported goods.", complexity: "Moderate" },

  // --- CA INTER ---
  { id: 'i1', name: "Consolidation of Financial Statements", level: "CA Inter", subject: "Advanced Accounting", desc: "Merging Parent and Subsidiary accounts made simple.", complexity: "Advanced" },
  { id: 'i2', name: "Accounting Standards (AS)", level: "CA Inter", subject: "Advanced Accounting", desc: "Mastering AS-1, AS-2, AS-10 and more for Inter exams.", complexity: "Moderate" },
  { id: 'i3', name: "Amalgamation of Companies", level: "CA Inter", subject: "Advanced Accounting", desc: "AS-14 logic: Purchase and Pooling of interest methods.", complexity: "Advanced" },
  { id: 'i4', name: "Cash Flow Statement", level: "CA Inter", subject: "Advanced Accounting", desc: "Tracking Operating, Investing, and Financing cash movements.", complexity: "Moderate" },
  { id: 'i5', name: "Management & Administration", level: "CA Inter", subject: "Corporate Laws", desc: "Notice, Quorum, and Resolutions (AGM/EGM) rules.", complexity: "Moderate" },
  { id: 'i6', name: "Share Capital & Debentures", level: "CA Inter", subject: "Corporate Laws", desc: "Issue of shares, sweat equity, and redemption logic.", complexity: "Moderate" },
  { id: 'i7', name: "Interpretation of Statutes", level: "CA Inter", subject: "Other Laws", desc: "Rules of reading the law: Literal, Harmonious, and more.", complexity: "Advanced" },
  { id: 'i8', name: "PGBP (Business Profits)", level: "CA Inter", subject: "Taxation", desc: "Profits and Gains of Business or Profession (Income Tax).", complexity: "Advanced" },
  { id: 'i9', name: "Salary Income", level: "CA Inter", subject: "Taxation", desc: "Allowances, Perquisites, and Deductions under Section 16.", complexity: "Moderate" },
  { id: 'i10', name: "Input Tax Credit (ITC)", level: "CA Inter", subject: "Taxation", desc: "The soul of GST - How to offset your tax liability.", complexity: "Moderate" },
  { id: 'i11', name: "Supply & Place of Supply", level: "CA Inter", subject: "Taxation", desc: "The starting point of GST: What is supply and where?", complexity: "Basic" },
  { id: 'i12', name: "Standard & Marginal Costing", level: "CA Inter", subject: "Costing", desc: "Variance analysis and Break-even point decision making.", complexity: "Advanced" },
  { id: 'i13', name: "Audit Report (SA 700 series)", level: "CA Inter", subject: "Auditing", desc: "Drafting the final opinion as an Independent Auditor.", complexity: "Moderate" },
  { id: 'i14', name: "Vouching & Verification", level: "CA Inter", subject: "Auditing", desc: "Checking the evidence for items in Profit & Loss and Balance Sheet.", complexity: "Basic" },
  { id: 'i15', name: "Capital Budgeting & Ratios", level: "CA Inter", subject: "FM & SM", desc: "NPV, IRR, and analyzing the health of a company.", complexity: "Advanced" },
  { id: 'i16', name: "Strategic Analysis & SWOT", level: "CA Inter", subject: "FM & SM", desc: "Analyzing Strengths, Weaknesses, Opportunities, and Threats.", complexity: "Basic" },

  // --- CA FOUNDATION ---
  { id: 't14', name: "Time Value of Money", level: "CA Foundation", subject: "Quantitative Aptitude", desc: "SI, CI, and Annuity - The most important maths topic.", complexity: "Advanced" },
  { id: 't15', name: "Blood Relations", level: "CA Foundation", subject: "Quantitative Aptitude", desc: "Solving family tree puzzles with simple diagrams.", complexity: "Basic" },
  { id: 't16', name: "Logical Reasoning Series", level: "CA Foundation", subject: "Quantitative Aptitude", desc: "Pattern recognition for numbers and alphabet series.", complexity: "Basic" },
  { id: 't17', name: "Central Tendency & Dispersion", level: "CA Foundation", subject: "Quantitative Aptitude", desc: "Mean, Median, Mode, and Standard Deviation concepts.", complexity: "Moderate" },
  { id: 't11', name: "Indian Contract Act (Offer & Acceptance)", level: "CA Foundation", subject: "Business Laws", desc: "Essentials of a valid contract explained simply.", complexity: "Moderate" },
  { id: 't12', name: "Companies Act 2013 Basics", level: "CA Foundation", subject: "Business Laws", desc: "Concept of Separate Legal Entity and Limited Liability.", complexity: "Basic" },
  { id: 't13', name: "Sale of Goods Act", level: "CA Foundation", subject: "Business Laws", desc: "Ownership, Conditions, and Warranties logic.", complexity: "Moderate" },
  { id: 't18', name: "Bank Reconciliation Statement (BRS)", level: "CA Foundation", subject: "Accounting", desc: "Matching Cash Book and Pass Book balances.", complexity: "Basic" },
  { id: 't8', name: "Depreciation Methods", level: "CA Foundation", subject: "Accounting", desc: "SLM vs WDV - How assets lose value over time.", complexity: "Moderate" },
  { id: 't9', name: "Final Accounts of Sole Proprietors", level: "CA Foundation", subject: "Accounting", desc: "Trading, P&L, and Balance Sheet preparation.", complexity: "Moderate" },
  { id: 't10', name: "Partnership (Admission/Retirement)", level: "CA Foundation", subject: "Accounting", desc: "Accounting adjustments when partners change.", complexity: "Advanced" }
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
          <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-6">Topics Made <span className="text-brand-primary">Simple</span></h1>
          <p className="text-brand-dark/60 text-lg max-w-2xl mx-auto">The ultimate knowledge base for CA Aspirants. Concepts decoded by Rankers.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fade-up">
           <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {levels.map(lvl => (
                <button key={lvl} onClick={() => setFilter(lvl)} className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === lvl ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-slate-400 hover:text-brand-primary'}`}>{lvl}</button>
              ))}
           </div>
           <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search topics or subjects..." className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 outline-none text-sm font-bold shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
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
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary">Detailed Explanation <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
             </div>
           ))}
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border-4 border-brand-cream shadow-xl flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0"><Lightbulb size={40} className="text-brand-orange animate-bounce-slow" /></div>
           <div>
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Don't see a topic?</h3>
              <p className="text-slate-500 max-w-xl">Our rankers update this library every week based on student requests. Join our community to request a new topic explanation.</p>
           </div>
           <button className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-sm hover:bg-brand-primary transition-all ml-auto">Request Topic</button>
        </div>
      </div>
    </div>
  );
};