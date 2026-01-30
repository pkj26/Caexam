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

// Reusable Header Component
const PageHeader = ({ title, subtitle, category, onBack }: { title: string, subtitle: string, category?: string, onBack: () => void }) => (
  <div className="bg-brand-dark text-white pt-24 pb-16 px-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
      <Globe size={300} className="text-brand-primary" />
    </div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-primary font-bold hover:text-white transition-colors"
        >
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

const PricingDetail = ({ onBack, onNavigate, onAddToCart }: { onBack: () => void, onNavigate: (v: ViewType) => void, onAddToCart: (item: any) => void }) => {
  const [selectedLevel, setSelectedLevel] = useState<'foundation' | 'inter' | 'final'>('final');

  const pricingData = {
    foundation: [
      {
        name: "Fast Track",
        price: 999,
        original: 2499,
        tag: "Last Minute Revision",
        features: ["2 Full Syllabus Tests", "Standard Evaluation (72h)", "Suggested Answers", "Email Support"],
        popular: false
      },
      {
        name: "Detailed Series",
        price: 1999,
        original: 4999,
        tag: "Most Popular",
        popular: true,
        features: ["12 Chapterwise Tests", "2 Full Syllabus Tests", "Priority Evaluation (48h)", "Topper Sheet Access", "WhatsApp Support"]
      },
      {
        name: "Mentorship Pro",
        price: 3499,
        original: 7999,
        tag: "Guaranteed Pass",
        features: ["All Detailed Series Features", "1-on-1 Mentorship Calls", "Personalized Study Planner", "On-Demand Doubt Solving", "Evaluation in 24h"],
        popular: false
      }
    ],
    inter: [
      {
        name: "Fast Track",
        price: 1499,
        original: 3499,
        tag: "Last Month Prep",
        features: ["3 Full Syllabus Tests", "Standard Evaluation", "Suggested Answers", "Performance Graph"],
        popular: false
      },
      {
        name: "Detailed Series",
        price: 3999,
        original: 8999,
        tag: "Best Seller",
        popular: true,
        features: ["16 Chapterwise Tests", "4 Full Syllabus Tests", "AIR Ranker Evaluation", "Detailed Comments", "24/7 Support"]
      },
      {
        name: "Ranker's Batch",
        price: 6999,
        original: 14999,
        tag: "Elite Club",
        features: ["Unlimited Chapterwise Tests", "Personal Mentor (AIR Holder)", "Daily Target Tracking", "Video Call Reviews", "Instant Evaluation"],
        popular: false
      }
    ],
    final: [
       {
        name: "Fast Track",
        price: 1999,
        original: 4999,
        tag: "Quick Review",
        features: ["2 Full Syllabus Tests", "Detailed Evaluation", "Suggested Answers", "Chat Support"],
        popular: false
      },
      {
        name: "Detailed Series",
        price: 4999,
        original: 11999,
        tag: "Recommended",
        popular: true,
        features: ["20 Chapterwise Tests", "5 Full Syllabus Tests", "Evaluated by Qualified CAs", "Paper-wise Analysis", "Priority Support"]
      },
      {
        name: "Sure-Pass Program",
        price: 9999,
        original: 24999,
        tag: "Premium",
        features: ["Complete Syllabus Coverage", "Weekly Mentorship Calls", "Customized Schedule", "Failed? Get 100% Refund*", "Access to Topper's Copies"],
        popular: false
      }
    ]
  };

  const currentPlans = pricingData[selectedLevel];

  const handleAddToCart = (plan: any) => {
    const itemToAdd = {
      id: `${plan.name.replace(/\s+/g, '-').toLowerCase()}-${selectedLevel}`,
      name: `${plan.name} - CA ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`,
      price: plan.price,
      originalPrice: plan.original,
      type: 'Test Series Plan'
    };
    onAddToCart(itemToAdd);
    onNavigate('checkout');
  };

  return (
    <div className="animate-fade-up">
      <PageHeader 
        title="Plans & Pricing" 
        subtitle="Invest in your CA Prefix. Choose a plan that suits your preparation style." 
        category="Pricing"
        onBack={onBack}
      />
      
      <div className="max-w-7xl mx-auto py-16 px-4">
        
        {/* Level Selector */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex relative">
            {(['foundation', 'inter', 'final'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 md:px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300 relative z-10 ${
                  selectedLevel === level 
                  ? 'bg-white text-brand-dark shadow-md' 
                  : 'text-brand-dark/50 hover:text-brand-dark'
                }`}
              >
                CA {level}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {currentPlans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-[2rem] p-8 border-2 transition-all duration-300 flex flex-col h-full ${plan.popular ? 'border-brand-primary shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 ${plan.popular ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-100 text-slate-500'}`}>
                  {plan.tag}
                </span>
                <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-display font-black text-brand-dark">₹{plan.price}</span>
                  <span className="text-sm text-slate-400 line-through decoration-slate-400/50">₹{plan.original}</span>
                </div>
                <p className="text-xs text-brand-dark/40 mt-2 font-medium">Valid till Exams</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${plan.popular ? 'text-brand-primary' : 'text-slate-400'}`} />
                    <span className="text-sm text-brand-dark/70 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? 'primary' : 'outline'} 
                fullWidth 
                className={!plan.popular ? 'border-slate-200 text-brand-dark hover:border-brand-primary hover:text-white' : ''}
                onClick={() => handleAddToCart(plan)}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DetailedPages: React.FC<DetailedPagesProps> = ({ view, topic, onBack, onNavigate, onAddToCart }) => {
  
  const TopicDetail = () => {
    if (!topic) return <div>Topic Not Found</div>;

    // Rich Topic Data Repository
    const topicData: Record<string, any> = {
      "what is gst?": {
        title: "GST Explained Simply",
        category: "Indirect Taxation",
        intro: "GST is like a single entry ticket to a fair. Instead of paying at every stall (Manufacturer, Wholesaler, Retailer), you pay only on the value you add.",
        diagram: {
          type: "flow",
          steps: [
            { label: "Manufacturer", tax: "₹10", desc: "Buys raw materials" },
            { label: "Wholesaler", tax: "₹2", desc: "Adds value & margin" },
            { label: "Retailer", tax: "₹3", desc: "Sells to customer" },
            { label: "Consumer", tax: "₹15", desc: "Pays final price" }
          ]
        },
        keyPoints: [
          "Destination Based Tax",
          "Removed Cascading Effect (Tax on Tax)",
          "Unified Market across India",
          "Input Tax Credit (ITC) is the backbone"
        ],
        simplifiedExample: "If you buy a shirt for ₹1000, the ₹50 tax goes once. Earlier, cotton had tax, thread had tax, and shirt had tax separately!"
      },
      "what is audit?": {
        title: "Audit: The Corporate Health Checkup",
        category: "Auditing",
        intro: "Think of an Auditor as a Doctor for a company's money. They check if the financial 'vitals' are normal and the company isn't hiding any illness (Fraud).",
        diagram: {
          type: "cycle",
          steps: ["Plan the Checkup", "Collect Evidence", "Check the Bills", "Give Final Report"]
        },
        keyPoints: [
          "Independent Examination",
          "True and Fair view check",
          "Not just finding frauds",
          "Trust for Shareholders"
        ],
        simplifiedExample: "Just like your school teacher checks your homework to ensure you didn't just copy the answers, an Auditor checks a company's books."
      },
      "what is dividend?": {
        title: "Dividend: Your Slice of the Profit Cake",
        category: "Economics / Law",
        intro: "When you invest in a company, you become a partner. When the company makes a profit, it gives you a 'Thank You' gift in cash—that's a Dividend.",
        diagram: {
          type: "simple",
          steps: ["Company Earns Profit", "Keeps some for growth", "Distributes rest to you"]
        },
        keyPoints: [
          "Part of Divisible Profit",
          "Decided by Board of Directors",
          "Paid to Shareholders",
          "Can be Final or Interim"
        ]
      }
    };

    const data = topicData[topic.toLowerCase()] || {
      title: `${topic} Simplified`,
      category: "CA Concept",
      intro: `Understanding ${topic} in the most simple way possible.`,
      keyPoints: ["Essential Concept", "Exam Favorite", "Conceptual Clarity", "Case Study Focus"],
      diagram: null
    };

    return (
      <div className="animate-fade-up">
        <PageHeader title={data.title} subtitle={data.category} category="Topic Library" onBack={onBack} />
        
        <div className="max-w-4xl mx-auto py-16 px-4">
           {/* Intro Card */}
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                    <Lightbulb size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-brand-dark uppercase tracking-widest text-[12px]">Layman Explanation</h2>
              </div>
              <p className="text-lg text-brand-dark/70 leading-relaxed font-medium">
                {data.intro}
              </p>
           </div>

           {/* Conceptual Diagram Builder */}
           {data.diagram && (
             <div className="mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-8">Visual Representation</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                   {data.diagram.steps.map((step: any, i: number) => (
                     <React.Fragment key={i}>
                        <div className="w-full md:w-40 bg-brand-cream border-2 border-brand-primary/10 rounded-2xl p-4 text-center hover:border-brand-primary transition-all group">
                           <p className="font-black text-brand-primary text-xs mb-1">{typeof step === 'string' ? step : step.label}</p>
                           {step.desc && <p className="text-[10px] text-slate-400 leading-tight">{step.desc}</p>}
                           {step.tax && <p className="text-[10px] font-bold text-brand-orange mt-2">{step.tax}</p>}
                        </div>
                        {i < data.diagram.steps.length - 1 && (
                          <div className="text-brand-primary/20 transform rotate-90 md:rotate-0">
                             <ChevronRight size={24} />
                          </div>
                        )}
                     </React.Fragment>
                   ))}
                </div>
             </div>
           )}

           {/* Key Takeaways */}
           <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                 <h4 className="font-bold text-brand-dark flex items-center gap-2">
                    <Zap className="text-brand-orange" size={18} /> Important Points
                 </h4>
                 <div className="space-y-3">
                    {data.keyPoints.map((p: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                         <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                         </div>
                         {p}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-brand-dark text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                 <div className="absolute -top-6 -right-6 opacity-10"><Target size={100}/></div>
                 <h4 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-brand-primary"/> Exam Weightage</h4>
                 <p className="text-xs text-white/60 leading-relaxed">This topic is usually tested for <span className="text-white font-black">4-6 Marks</span> in Descriptive or MCQs. ICAI loves asking "Application based" questions on this.</p>
                 <button onClick={() => onNavigate('pricing-detail')} className="mt-6 text-[10px] font-black uppercase text-brand-primary hover:text-white transition-colors">Solve Practice Questions →</button>
              </div>
           </div>

           {/* Help Section */}
           <div className="text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-200">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <HelpCircle size={24} />
              </div>
              <h4 className="text-lg font-bold text-brand-dark mb-2">Still Confused?</h4>
              <p className="text-sm text-slate-500 mb-6">Our All India Rankers can explain this to you on a 1-on-1 Mentorship call.</p>
              <Button variant="outline" onClick={() => onNavigate('student-login')}>Book a Free Doubt Session</Button>
           </div>
        </div>
      </div>
    );
  };

  const TestSeriesDetail = () => {
    const categories = [
      {
        id: 'foundation',
        title: 'CA Foundation Test Series',
        icon: BookOpen,
        color: 'bg-blue-500',
        papers: [
          { code: 'P1', name: 'Accounting', type: 'Objective & Descriptive' },
          { code: 'P2', name: 'Business Laws', type: 'Descriptive' },
          { code: 'P3', name: 'Quantitative Aptitude', type: 'Objective (MCQ)' },
          { code: 'P4', name: 'Business Economics', type: 'Objective (MCQ)' },
        ]
      },
      {
        id: 'inter-g1',
        title: 'CA Inter Group 1',
        icon: GraduationCap,
        color: 'bg-brand-primary',
        papers: [
          { code: 'P1', name: 'Advanced Accounting', type: 'Descriptive' },
          { code: 'P2', name: 'Corporate & Other Laws', type: 'Descriptive + MCQ' },
          { code: 'P3', name: 'Taxation (DT & GST)', type: 'Descriptive + MCQ' },
        ]
      },
      {
        id: 'inter-g2',
        title: 'CA Inter Group 2',
        icon: GraduationCap,
        color: 'bg-brand-orange',
        papers: [
          { code: 'P4', name: 'Cost & Mgmt Accounting', type: 'Descriptive' },
          { code: 'P5', name: 'Auditing & Ethics', type: 'Descriptive + MCQ' },
          { code: 'P6', name: 'FM & SM', type: 'Descriptive + MCQ' },
        ]
      },
      {
        id: 'final-g1',
        title: 'CA Final Group 1',
        icon: Award,
        color: 'bg-indigo-600',
        papers: [
          { code: 'P1', name: 'Financial Reporting', type: 'Descriptive' },
          { code: 'P2', name: 'Adv. Financial Mgmt', type: 'Descriptive' },
          { code: 'P3', name: 'Adv. Auditing & Ethics', type: 'Descriptive + MCQ' },
        ]
      },
      {
        id: 'final-g2',
        title: 'CA Final Group 2',
        icon: Award,
        color: 'bg-rose-600',
        papers: [
          { code: 'P4', name: 'Direct Tax Laws', type: 'Descriptive + MCQ' },
          { code: 'P5', name: 'Indirect Tax Laws', type: 'Descriptive + MCQ' },
          { code: 'P6', name: 'IBS (Multidisciplinary)', type: 'Open Book Integrated' },
        ]
      },
    ];

    return (
      <div className="animate-fade-up">
        <PageHeader title="About Our Test Series" subtitle="Comprehensive details of all papers across Foundation, Inter, and Final levels." category="Paper Catalog" onBack={onBack} />
        
        <div className="max-w-7xl mx-auto py-20 px-4">
          <div className="space-y-24">
            {categories.map((cat, idx) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-10">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-xl`}>
                    <cat.icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-brand-dark">{cat.title}</h2>
                    <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px] mt-1">Based on New Scheme 2024</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.papers.map((paper) => (
                    <div key={paper.code} className="bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl transition-all group border-b-4 border-b-transparent hover:border-b-brand-primary">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">{paper.code}</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-brand-orange text-brand-orange" />)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{paper.name}</h3>
                      <p className="text-xs text-brand-dark/40 font-bold mb-6 flex items-center gap-2">
                        <Info size={12} /> {paper.type} Pattern
                      </p>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-brand-dark/60">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span>4 Unit Tests</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-brand-dark/60">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span>2 Full Syllabus Tests</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-brand-dark/60">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span>AIR Evaluation</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <button className="flex items-center justify-center gap-2 py-2.5 bg-brand-cream rounded-xl text-[10px] font-black uppercase text-brand-dark/60 hover:bg-brand-primary hover:text-white transition-all">
                           <Download size={14} /> Schedule
                         </button>
                         <button className="flex items-center justify-center gap-2 py-2.5 bg-brand-cream rounded-xl text-[10px] font-black uppercase text-brand-dark/60 hover:bg-brand-primary hover:text-white transition-all">
                           <FileText size={14} /> Sample
                         </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary Card for the Category */}
                  <div className={`rounded-[2.5rem] p-10 flex flex-col justify-center text-white relative overflow-hidden ${cat.color}`}>
                     <div className="absolute -top-10 -right-10 opacity-20 rotate-12">
                        <cat.icon size={200} />
                     </div>
                     <h4 className="text-2xl font-display font-black mb-4 relative z-10">Complete {cat.title} Pack</h4>
                     <p className="text-white/80 text-sm mb-8 leading-relaxed relative z-10">Get all papers in this group with a 65% discount and priority evaluation from top rankers.</p>
                     <Button variant="outline" className="border-white/40 text-white hover:bg-white hover:text-brand-dark relative z-10 !py-3">
                        Enroll Now
                     </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AboutDetail = () => (
    <div className="animate-fade-up">
      <PageHeader title="About Our Legacy" subtitle="Learn how we became India's most trusted evaluation platform for CA aspirants." onBack={onBack} />
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-display font-bold text-brand-dark flex items-center gap-3">
            <Info className="text-brand-primary" /> The Genesis
          </h2>
          <p className="text-brand-dark/70 leading-relaxed text-lg">
            Founded in 2018, CA Test Series started in a small room in Delhi with a team of 3 AIR rankers. Our founder, an AIR 14 holder, realized that while there were plenty of coaching classes, there was zero focus on <strong>how to write exams</strong>. Students knew the concepts but failed because they couldn't present them according to ICAI requirements.
          </p>
          <div className="grid md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-white rounded-2xl border border-brand-primary/10 shadow-sm">
              <Target className="text-brand-orange mb-4" />
              <h4 className="font-bold mb-2">Our Core Value</h4>
              <p className="text-sm text-brand-dark/60">We believe every student has the potential to be a CA. The only thing missing is a corrective mirror for their mistakes.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-brand-primary/10 shadow-sm">
              <Shield className="text-brand-primary mb-4" />
              <h4 className="font-bold mb-2">Integrity First</h4>
              <p className="text-sm text-brand-dark/60">No automated checking. No semi-qualified staff. Only Qualified CAs check every single page.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const TestDetail = () => (
    <div className="animate-fade-up">
      <PageHeader title="Detailed Test Catalog" subtitle="Explore every subject, chapter, and paper in our exhaustive test series." onBack={onBack} />
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Level Column */}
          <div className="space-y-8">
            <div className="p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
              <h3 className="text-2xl font-display font-bold text-brand-primary mb-4">CA Foundation</h3>
              <p className="text-sm text-brand-dark/60 mb-6">Entry level testing for the base of your CA career. Includes 4 Papers.</p>
              <ul className="space-y-3">
                <li className="font-bold text-brand-dark">Papers Included:</li>
                {["P1: Accounting (100m)", "P2: Business Laws (100m)", "P3: Quantitative Aptitude (100m)", "P4: Business Economics (100m)"].map(p => (
                  <li key={p} className="text-sm text-brand-dark/70 flex items-center gap-2">
                    <BookCheck size={14} className="text-brand-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProcessDetail = () => (
    <div className="animate-fade-up">
      <PageHeader title="The Evaluation Science" subtitle="Behind the scenes of how your performance is analyzed by AIR Rankers." onBack={onBack} />
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-16">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Step 1: Digital Scanning</h2>
            <p className="text-brand-dark/70 leading-relaxed">
              Upload your scanned sheets via our portal. We use advanced OCR to index your pages.
            </p>
          </div>
          <div className="bg-brand-cream aspect-video rounded-2xl border-4 border-dashed border-brand-primary/20 flex items-center justify-center">
            <ClipboardList size={48} className="text-brand-primary/40" />
          </div>
        </section>
      </div>
    </div>
  );

  const MentorsDetail = () => (
    <div className="animate-fade-up">
      <PageHeader title="Our Elite Mentors" subtitle="Meet the minds behind your evaluation and mentorship." onBack={onBack} />
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "CA Rohit Sethi", rank: "AIR 14", exp: "8 Years", spec: "Audit & Assurance", bio: "Rohit has evaluated over 10,000 copies and specializes in detecting subtle presentation errors." },
            { name: "CA Neha Gupta", rank: "AIR 08", exp: "5 Years", spec: "Direct Taxation", bio: "Neha's focus is on the latest amendments and case laws." },
            { name: "CA Amit Kumar", rank: "Ex-Big 4", exp: "12 Years", spec: "Financial Reporting", bio: "Amit brings practical corporate experience to his evaluation." }
          ].map((m, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-brand-primary/10 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary mb-6">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-1">{m.name}</h3>
              <div className="flex gap-2 mb-4">
                 <span className="text-xs font-bold px-2 py-0.5 bg-brand-primary text-white rounded-full">{m.rank}</span>
                 <span className="text-xs font-bold px-2 py-0.5 bg-brand-orange/10 text-brand-orange rounded-full">{m.exp} Exp</span>
              </div>
              <p className="text-sm text-brand-dark/70 leading-relaxed mb-6">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const pages = {
    'about-detail': <AboutDetail />,
    'test-detail': <TestDetail />,
    'test-series-detail': <TestSeriesDetail />,
    'process-detail': <ProcessDetail />,
    'mentors-detail': <MentorsDetail />,
    'pricing-detail': <PricingDetail onBack={onBack} onNavigate={onNavigate} onAddToCart={onAddToCart} />,
    'topic-detail': <TopicDetail />,
    'home': <div>Should not be here</div>
  };

  return (
    <div className="bg-white min-h-screen">
      {pages[view as keyof typeof pages] || pages['about-detail']}
      
      {/* Bottom CTA for all detail pages */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to start your journey?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={onBack}>Get Started Now</Button>
            <Button variant="outline">Download Free Sample</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
// Add Globe import to satisfy the dynamic header
const Globe = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);