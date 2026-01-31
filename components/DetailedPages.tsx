import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Shield, Users, Target, BookCheck, ClipboardList, Info, GraduationCap, Star, Share2, Download, FileText, ChevronRight, Bookmark, BookOpen, Layers, Award, Check, Zap, Lightbulb, TrendingUp, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { ViewType } from '../App';

interface DetailedPagesProps {
  view: ViewType;
  topic?: string | null;
  onBack: () => void;
  onNavigate: (view: ViewType, topic?: string) => void;
  onAddToCart: (item: any) => void;
}

const PageHeader = ({ title, subtitle, category, onBack }: { title: string, subtitle: string, category?: string, onBack: () => void }) => (
  <div className="bg-brand-dark text-white pt-24 pb-16 px-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
      <Globe size={300} className="text-brand-primary" />
    </div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-bold hover:text-white transition-colors">
          <ArrowLeft size={20} /> Home
        </button>
        {category && (
          <>
            <ChevronRight size={16} className="text-white/20" />
            <span className="text-white/40 font-bold text-sm uppercase tracking-widest">{category}</span>
          </>
        )}
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 capitalize">{title}</h1>
      <p className="text-brand-cream/60 text-lg max-w-2xl">{subtitle}</p>
    </div>
  </div>
);

export const DetailedPages: React.FC<DetailedPagesProps> = ({ view, topic, onBack, onNavigate, onAddToCart }) => {
  const TopicDetail = () => {
    if (!topic) return <div>Topic Not Found</div>;

    const topicData: Record<string, any> = {
      // --- CA FINAL ---
      "ind as 115 revenue": {
        title: "Ind AS 115: Revenue Control Model",
        category: "CA Final FR",
        intro: "Ind AS 115 replaces 'Risk & Reward' with 'Control'. It uses a standard 5-step process to recognize revenue.",
        diagram: {
          type: "flow",
          steps: [{label: "Contract"}, {label: "Obligations"}, {label: "Price"}, {label: "Allocation"}, {label: "Recognition"}]
        },
        keyPoints: ["Identify distinct performance obligations", "Estimate variable consideration", "Allocate transaction price", "Recognize over time or at point in time"]
      },
      "professional ethics (clauses)": {
        title: "Professional Ethics: Mastering Clauses",
        category: "CA Final Audit",
        intro: "Ethics is the highest scoring part of CA Final Audit. It deals with the Code of Ethics and the Chartered Accountants Act.",
        diagram: {
          type: "flow",
          steps: [{label: "First Schedule", desc: "Members in practice"}, {label: "Second Schedule", desc: "General misconduct"}]
        },
        keyPoints: ["Clause 6: No advertising", "Clause 7: Titles usage", "Clause 2: Substantial interest disclosure", "Ethics Code: Fundamental Principles"]
      },
      "derivatives & hedging": {
        title: "Derivatives & Hedging Logic",
        category: "CA Final AFM",
        intro: "Hedging is like insurance for prices. Derivatives help you fix the price today for a future transaction.",
        diagram: {
          type: "simple",
          steps: [{label: "Future"}, {label: "Option"}, {label: "Swap"}]
        },
        keyPoints: ["Hedging reduces price risk", "Futures: Obligatory contract", "Options: Right to buy/sell", "Hedging effectiveness (Ind AS 109)"]
      },
      "international taxation & transfer pricing": {
        title: "Transfer Pricing (ALP)",
        category: "CA Final DT",
        intro: "MNCs can shift profits. Transfer Pricing ensures they deal at 'Arm's Length Prices'.",
        diagram: {
          type: "flow",
          steps: [{label: "Assoc. Enterprise"}, {label: "Intl Transaction"}, {label: "ALP Method"}, {label: "Tax Adjustment"}]
        },
        keyPoints: ["Methods: CUP, TNMM, Resale Price", "DTAA (Section 90/91)", "Safe Harbour Rules", "APA (Advance Pricing Agreement)"]
      },
      "blocked credits (gst sec 17(5))": {
        title: "Blocked Credit (Section 17(5))",
        category: "CA Final IDT",
        intro: "In GST, certain items are 'Blocked'. You cannot claim Input Tax Credit even if used for business.",
        diagram: {
          type: "simple",
          steps: [{label: "Motor Vehicles"}, {label: "Food/Catering"}, {label: "Works Contract"}]
        },
        keyPoints: ["ITC blocked on luxury items", "Blocked for goods lost or stolen", "Blocked for corporate gifts", "Exceptions (e.g., further supply)"]
      },

      // --- CA INTER ---
      "input tax credit (itc)": {
        title: "ITC: The Soul of GST",
        category: "CA Inter Tax",
        intro: "ITC allows you to reduce the tax you have already paid on inputs from your final output tax liability.",
        diagram: {
          type: "flow",
          steps: [{label: "Purchase"}, {label: "Credit Ledger"}, {label: "Tax Offset"}]
        },
        keyPoints: ["Valid tax invoice required", "Goods/Services must be received", "Supplier must pay tax to Govt", "GSTR-2B matching mandatory"]
      },
      "standard & marginal costing": {
        title: "Standard vs Marginal Costing",
        category: "CA Inter Costing",
        intro: "Standard costing is for performance measurement. Marginal costing is for decision making (Break-even).",
        diagram: {
          type: "simple",
          steps: [{label: "Standard"}, {label: "Actual"}, {label: "Variance"}]
        },
        keyPoints: ["Variance: Budgeted vs Actual", "P/V Ratio logic", "Margin of Safety", "Contribution Analysis"]
      },
      "management & administration": {
        title: "AGM, EGM & Resolutions",
        category: "CA Inter Law",
        intro: "Company meetings are the backbone of administration. Understanding how decisions are made legally.",
        diagram: {
          type: "flow",
          steps: [{label: "Notice"}, {label: "Quorum"}, {label: "Resolution"}]
        },
        keyPoints: ["21 clear days notice", "Ordinary vs Special Resolution", "Annual General Meeting (Section 96)", "Proxy voting rules"]
      },
      "consolidation of financial statements": {
        title: "Consolidation (Inter Level)",
        category: "CA Inter Adv Acc",
        intro: "Merging Parent and Subsidiary accounts. Removing inter-company balances.",
        diagram: {
          type: "flow",
          steps: [{label: "Parent Co"}, {label: "Minority Int."}, {label: "Consolidated BS"}]
        },
        keyPoints: ["Eliminate inter-co sales", "Calculate Minority Interest", "Goodwill vs Capital Reserve", "Pre-acquisition vs Post-acquisition"]
      },
      "strategic analysis & swot": {
        title: "SWOT: Your Strategic Compass",
        category: "CA Inter FM & SM",
        intro: "A tool to analyze internal Strengths/Weaknesses and external Opportunities/Threats.",
        diagram: {
          type: "grid",
          steps: [{label: "Internal", desc: "S & W"}, {label: "External", desc: "O & T"}]
        },
        keyPoints: ["Strength: Competitive edge", "Weakness: Limitations", "Opportunity: Market trends", "Threat: Competitors/Economy"]
      },

      // --- CA FOUNDATION ---
      "time value of money": {
        title: "Time Value of Money (TVM)",
        category: "CA Foundation Maths",
        intro: "TVM is the logic that '1 Rupee today is worth more than 1 Rupee tomorrow' due to interest.",
        diagram: {
          type: "simple",
          steps: [{label: "Present Value"}, {label: "Interest Rate"}, {label: "Future Value"}]
        },
        keyPoints: ["Simple Interest: PNR/100", "Compound Interest (Growth)", "Annuity: Equal regular payments", "Perpetuity basics"]
      },
      "blood relations": {
        title: "Blood Relations: Family Mapping",
        category: "CA Foundation LR",
        intro: "Solving relationship puzzles using gender and generation mapping.",
        diagram: {
          type: "flow",
          steps: [{label: "Gen 1 (G.Parents)"}, {label: "Gen 2 (Parents)"}, {label: "Gen 3 (You)"}]
        },
        keyPoints: ["Use (+) for Male, (-) for Female", "Vertical lines for generations", "Double lines for couples", "Watch out for 'Only son' tricks"]
      },
      "indian contract act (offer & acceptance)": {
        title: "The Law of Contract",
        category: "CA Foundation Law",
        intro: "A contract starts with an Offer and its absolute Acceptance. Without this, no agreement exists.",
        diagram: {
          type: "flow",
          steps: [{label: "Offer"}, {label: "Acceptance"}, {label: "Agreement"}, {label: "Enforceability"}]
        },
        keyPoints: ["Offer must be definite", "Acceptance must be absolute", "Consideration (Something in return)", "Intention to create legal relation"]
      },
      "bank reconciliation statement (brs)": {
        title: "BRS: Matching the Books",
        category: "CA Foundation Accounts",
        intro: "Matching the balance as per Cash Book with the balance as per Bank Pass Book.",
        diagram: {
          type: "simple",
          steps: [{label: "Cash Book"}, {label: "Reconciliation"}, {label: "Pass Book"}]
        },
        keyPoints: ["Cheques issued but not presented", "Cheques deposited but not cleared", "Bank charges/Interest", "Errors in posting"]
      },
      "partnership (admission/retirement)": {
        title: "Partnership Accounting",
        category: "CA Foundation Accounts",
        intro: "Accounting when a partner enters or leaves a firm. Adjusting profit sharing and assets.",
        diagram: {
          type: "simple",
          steps: [{label: "Revaluation"}, {label: "Goodwill Adjustment"}, {label: "Capital A/cs"}]
        },
        keyPoints: ["Sacrificing vs Gaining Ratio", "Revaluation of Assets/Liabilities", "Accumulated Profits distribution", "Goodwill valuation methods"]
      }
    };

    const data = topicData[topic.toLowerCase()] || {
      title: `${topic} Simplified`,
      category: "CA Concept",
      intro: `Understanding ${topic} with Ranker shortcuts and conceptual clarity.`,
      keyPoints: ["High weightage topic", "Exam favorite", "Focus on keywords", "Diagrammatic representation"],
      diagram: null
    };

    return (
      <div className="animate-fade-up">
        <PageHeader title={data.title} subtitle={data.category} category="Encyclopedia" onBack={onBack} />
        <div className="max-w-4xl mx-auto py-16 px-4">
           {/* Layman Intro */}
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center"><Lightbulb size={24} /></div>
                 <h2 className="text-xl font-bold text-brand-dark uppercase tracking-widest text-[12px]">Layman Explanation</h2>
              </div>
              <p className="text-lg text-brand-dark/70 leading-relaxed font-medium">{data.intro}</p>
           </div>

           {/* Conceptual Diagram */}
           {data.diagram && (
             <div className="mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-8">Concept Visualizer</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                   {data.diagram.steps.map((step: any, i: number) => (
                     <React.Fragment key={i}>
                        <div className="w-full md:w-40 bg-brand-cream border-2 border-brand-primary/10 rounded-2xl p-4 text-center hover:border-brand-primary transition-all group">
                           <p className="font-black text-brand-primary text-xs mb-1">{step.label}</p>
                           {step.desc && <p className="text-[10px] text-slate-400 leading-tight">{step.desc}</p>}
                        </div>
                        {i < data.diagram.steps.length - 1 && <div className="text-brand-primary/20 transform rotate-90 md:rotate-0"><ChevronRight size={24} /></div>}
                     </React.Fragment>
                   ))}
                </div>
             </div>
           )}

           {/* Key Points */}
           <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                 <h4 className="font-bold text-brand-dark flex items-center gap-2"><Zap className="text-brand-orange" size={18} /> Important Notes</h4>
                 <div className="space-y-3">
                    {data.keyPoints.map((p: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                         <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-green-600" /></div>
                         {p}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-brand-dark text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                 <div className="absolute -top-6 -right-6 opacity-10"><Target size={100}/></div>
                 <h4 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-brand-primary"/> Ranker's Advice</h4>
                 <p className="text-xs text-white/60 leading-relaxed">This topic usually carries <span className="text-white font-black">6-10 Marks</span>. Don't memorize, understand the logic for the practical case studies.</p>
                 <button onClick={() => onNavigate('pricing-detail')} className="mt-6 text-[10px] font-black uppercase text-brand-primary hover:text-white transition-colors">Solve Practice Tests →</button>
              </div>
           </div>

           <div className="text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400"><HelpCircle size={24} /></div>
              <h4 className="text-lg font-bold text-brand-dark mb-2">Still Confused?</h4>
              <p className="text-sm text-slate-500 mb-6">Book a 1-on-1 mentorship call with a CA Ranker to clear your doubts on this topic.</p>
              <Button variant="primary" onClick={() => onNavigate('pricing-detail')}>Explore Mentorship Plans</Button>
           </div>
        </div>
      </div>
    );
  };

  const pages = {
    'topic-detail': <TopicDetail />,
    'pricing-detail': <div className="p-20 text-center">Pricing Page</div>,
    'student-login': <div className="p-20 text-center">Login Page</div>
  };

  return (
    <div className="bg-white min-h-screen">
      {pages[view as keyof typeof pages] || pages['topic-detail']}
    </div>
  );
};

const Globe = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);