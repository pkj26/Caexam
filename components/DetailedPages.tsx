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
      // CA FINAL TOPICS
      "ind as 115 revenue": {
        title: "Ind AS 115: The 5-Step Model",
        category: "CA Final Financial Reporting",
        intro: "Ind AS 115 changed the game from 'Risk & Reward' to 'Control'. It uses a standard 5-step process to decide when and how much revenue to book in the accounts.",
        diagram: {
          type: "flow",
          steps: [
            { label: "Contract", desc: "Identify the agreement" },
            { label: "Obligations", desc: "Separate promises" },
            { label: "Price", desc: "Determine Transaction Price" },
            { label: "Allocation", desc: "Divide price into obligations" },
            { label: "Recognition", desc: "Book revenue on control" }
          ]
        },
        keyPoints: [
          "Focus on 'Control' transfer, not just 'Risk'",
          "Variable Consideration (Bonus/Penalties) estimation",
          "Contract Modifications logic",
          "Time value of money adjustment (Signi. Financing)"
        ],
        simplifiedExample: "If you buy a phone + 1 year service for ₹12k, Ind AS 115 says you can't book ₹12k today. You must book Phone value today and Service value over the year."
      },
      "derivatives & hedging": {
        title: "Derivatives: Managing Risks",
        category: "CA Final AFM",
        intro: "Derivatives are like 'Insurance' for prices. If you're afraid gold prices will go up, you buy a derivative to fix the price today.",
        diagram: {
          type: "simple",
          steps: [
            { label: "Futures", desc: "Mandatory contract" },
            { label: "Options", desc: "Right, not obligation" },
            { label: "Swaps", desc: "Exchange of cashflows" }
          ]
        },
        keyPoints: [
          "Hedging vs Speculation vs Arbitrage",
          "Mark-to-Market (MTM) settlement",
          "Black-Scholes Model basics",
          "Interest Rate Risk management"
        ],
        simplifiedExample: "An airline buys fuel futures to fix prices for next 6 months. Even if global oil prices double, the airline is safe. That's Hedging!"
      },
      "professional ethics (clauses)": {
        title: "Professional Ethics: Clauses & Code",
        category: "CA Final Audit & Ethics",
        intro: "This is the most scoring part of Audit. It's the 'Rules of Conduct' for every CA. Breaking these can lead to cancellation of membership.",
        diagram: {
          type: "simple",
          steps: [
            { label: "1st Schedule", desc: "Misconduct for members" },
            { label: "2nd Schedule", desc: "Serious offenses" },
            { label: "Council Guidelines", desc: "Fees, Ads, etc." }
          ]
        },
        keyPoints: [
          "Clause 6 (1st Schedule): Advertising rules",
          "Clause 7: Using titles other than CA",
          "Clause 2 (2nd Schedule): Confidentiality breach",
          "Audit Fees cannot be % of profits"
        ],
        simplifiedExample: "A CA cannot give an ad in a newspaper saying 'I am the best Auditor in Delhi'. This violates Clause 6 of the First Schedule."
      },
      "international taxation (transfer pricing)": {
        title: "Transfer Pricing & DTAA",
        category: "CA Final Direct Tax",
        intro: "When global giants like Google deal with their Indian office, they might manipulate prices to save tax. Transfer Pricing ensures they use 'Arm's Length Prices'.",
        diagram: {
          type: "flow",
          steps: [
            { label: "Associated Ent.", desc: "Sister concerns" },
            { label: "Intl. Transaction", desc: "Cross border deal" },
            { label: "ALP Method", desc: "CUP, TNMM, RPM etc." },
            { label: "Adjustment", desc: "Tax on fair price" }
          ]
        },
        keyPoints: [
          "Arm's Length Price (ALP) calculation",
          "Safe Harbour Rules for simplicity",
          "DTAA: Taxing rights between 2 nations",
          "Base Erosion and Profit Shifting (BEPS) basics"
        ],
        simplifiedExample: "If Apple USA sells an iPhone to Apple India for ₹1 Lac (Actual cost ₹50k) to reduce India profits, IT dept will use ALP of ₹50k to calculate tax."
      },
      "blocked credits (gst sec 17(5))": {
        title: "Blocked Credit: The Negative List",
        category: "CA Final Indirect Tax",
        intro: "In GST, you get credit for almost everything, EXCEPT items in the Blocked List. These are usually personal consumption items or specifically restricted ones.",
        diagram: {
          type: "grid",
          steps: [
            { label: "Cars", desc: "Blocked (with exceptions)" },
            { label: "Food/Catering", desc: "Blocked (mostly)" },
            { label: "Construction", desc: "Blocked for fixed assets" }
          ]
        },
        keyPoints: [
          "Section 17(5) overrides everything",
          "Credit allowed if car is for driving school",
          "Credit blocked on goods lost or stolen",
          "Corporate gifts ITC is blocked"
        ],
        simplifiedExample: "If a company buys a luxury car for its CEO, it cannot claim 28% GST back. But if a travel agency buys the same car, it CAN claim credit."
      },
      // CA INTER TOPICS
      "consolidation of financial statements": {
        title: "Consolidation: Merging the Empire",
        category: "CA Inter Advanced Accounting",
        intro: "Consolidation is like making a family budget. You don't count money given from a father to a son, you only count what the family earns from outside.",
        diagram: {
          type: "flow",
          steps: [
            { label: "Parent Co", desc: "The Controller" },
            { label: "Elimination", desc: "Remove Inter-co deals" },
            { label: "Consolidated A/c", desc: "Single entity" }
          ]
        },
        keyPoints: [
          "Control = Power to govern policies",
          "Eliminate 100% inter-company sales",
          "Minority Interest calculation",
          "Goodwill vs Capital Reserve"
        ]
      }
    };

    const data = topicData[topic.toLowerCase()] || {
      title: `${topic} Analysis`,
      category: "CA Technical Topic",
      intro: `Mastering ${topic} with conceptual clarity and exam-focused approach.`,
      keyPoints: ["Advanced Technicality", "High Weightage", "Case Study Based", "Latest Amendments"],
      diagram: null
    };

    return (
      <div className="animate-fade-up">
        <PageHeader title={data.title} subtitle={data.category} category="Encyclopedia" onBack={onBack} />
        <div className="max-w-4xl mx-auto py-16 px-4">
           {/* Technical Intro */}
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center"><Lightbulb size={24} /></div>
                 <h2 className="text-xl font-bold text-brand-dark uppercase tracking-widest text-[12px]">Concept Analysis</h2>
              </div>
              <p className="text-lg text-brand-dark/70 leading-relaxed font-medium">{data.intro}</p>
           </div>

           {/* Logic Diagram */}
           {data.diagram && (
             <div className="mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-8">Technical Logic Flow</h3>
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

           {/* Stats & Points */}
           <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                 <h4 className="font-bold text-brand-dark flex items-center gap-2"><Zap className="text-brand-orange" size={18} /> Critical Points</h4>
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
                 <h4 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-brand-primary"/> Weightage Analysis</h4>
                 <p className="text-xs text-white/60 leading-relaxed">In {data.category.includes('Final') ? 'CA Final' : 'CA Exams'}, this usually holds <span className="text-white font-black">12-16 Marks</span>. We suggest prioritizing the case-study approach here.</p>
                 <button onClick={() => onNavigate('pricing-detail')} className="mt-6 text-[10px] font-black uppercase text-brand-primary hover:text-white transition-colors">Solve Ranker Papers →</button>
              </div>
           </div>

           {/* Ranker Tip */}
           {data.simplifiedExample && (
             <div className="mb-12 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 relative">
               <div className="absolute top-4 right-8 opacity-10"><Star size={40} className="fill-blue-500" /></div>
               <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2"><Info size={16}/> Case Scenario Example</h4>
               <p className="text-sm text-blue-700/80 leading-relaxed italic">{data.simplifiedExample}</p>
             </div>
           )}

           {/* Support */}
           <div className="text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400"><HelpCircle size={24} /></div>
              <h4 className="text-lg font-bold text-brand-dark mb-2">Technical Difficulty?</h4>
              <p className="text-sm text-slate-500 mb-6">Our All India Rankers provide 1-on-1 calls to simplify these technical CA Final subjects.</p>
              <Button variant="primary" onClick={() => onNavigate('pricing-detail')}>Book Mentorship Call</Button>
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
      <section className="py-20 bg-brand-cream">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-display font-bold mb-6">Master CA Final Concepts</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={onBack}>Join Test Series</Button>
            <Button variant="outline">Download Technical Notes</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Globe = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);