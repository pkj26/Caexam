import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Shield, Users, Target, BookCheck, ClipboardList, Info, GraduationCap, Star, Share2, Download, FileText, ChevronRight, Bookmark, BookOpen, Layers, Award, Check } from 'lucide-react';
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

// Pricing Detail Component
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

        {/* Comparison Table */}
        <div className="mt-24 hidden md:block">
          <h3 className="text-2xl font-display font-bold text-center mb-12">Detailed Feature Comparison</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-5 px-8 text-xs font-black text-brand-dark/40 uppercase tracking-widest w-1/3">Features</th>
                  {currentPlans.map((p, i) => (
                    <th key={i} className={`py-5 px-8 text-center text-lg font-bold ${p.popular ? 'text-brand-primary' : 'text-brand-dark'}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: "Number of Tests", v: ["2 Full Tests", "14 Tests", "Unlimited"] },
                  { label: "Evaluation Time", v: ["72 Hours", "48 Hours", "24 Hours"] },
                  { label: "Suggested Answers", v: [true, true, true] },
                  { label: "Topper Sheet Access", v: [false, true, true] },
                  { label: "Mentorship Calls", v: ["No", "1 Call", "Weekly Calls"] },
                  { label: "Custom Schedule", v: [false, false, true] },
                  { label: "Pass Guarantee", v: [false, false, true] },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-8 text-sm font-bold text-brand-dark">{row.label}</td>
                    {row.v.map((val, vIdx) => (
                      <td key={vIdx} className="py-4 px-8 text-center text-sm text-slate-600">
                        {val === true ? <CheckCircle2 size={20} className="mx-auto text-green-500 fill-green-50" /> : 
                         val === false ? <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mx-auto" /> : 
                         <span className="font-bold">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refund Policy Note */}
        <div className="mt-16 bg-brand-cream border border-brand-orange/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0">
             <Shield className="text-brand-orange" size={24} />
          </div>
          <div>
            <h4 className="text-xl font-display font-bold text-brand-dark mb-2">100% Money Back Guarantee</h4>
            <p className="text-brand-dark/70 leading-relaxed">
              We are so confident in our evaluation quality that if you find any discrepancy in our checking compared to ICAI standards, or if we fail to deliver within the promised time, we will refund your entire fee for that test. No questions asked.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const DetailedPages: React.FC<DetailedPagesProps> = ({ view, topic, onBack, onNavigate, onAddToCart }) => {
  
  const TopicDetail = () => {
    if (!topic) return <div>Topic Not Found</div>;

    // SEO Data Repository for Topics
    const topicData: Record<string, any> = {
      "ca final audit mcq": {
        title: "Mastering CA Final Audit MCQs: Strategies & Practice",
        desc: "Everything you need to know about ICAI's 30-mark MCQ pattern for Audit.",
        points: ["Understand 'Case Scenario' based questions", "Focus on Standard on Auditing (SA) Keywords", "Integrated MCQ Practice strategy", "Negative marking precautions"],
        content: "MCQs in CA Final Audit are not just memory-based; they are highly conceptual. ICAI now focuses on testing your 'Professional Skepticism' through integrated case studies. To rank #1 in this subject, you must master the art of elimination and keyword identification."
      },
      "icai new scheme 2024": {
        title: "Complete Guide to ICAI New Scheme 2024",
        desc: "Deep dive into the syllabus changes, exam pattern shifts, and transition rules.",
        points: ["Self-Paced Module requirements", "Changes in Grouping & Exemptions", "Negative Marking for MCQs", "New Subjects & Integrated Business Solutions"],
        content: "The 2024 New Scheme is a paradigm shift towards global standards. With the introduction of Self-Paced modules and the multidisciplinary Paper 6, students need a fresh approach. Our test series is 100% updated to mirror these changes."
      },
      "air 1 strategy": {
        title: "The Ultimate AIR 1 Preparation Roadmap",
        desc: "Proven tactics used by CA toppers to secure All India Rank 1.",
        points: ["Three-cycle revision plan", "Daily Writing Practice (The X-Factor)", "ICAI Study Material focus", "Mental Health & Consistency"],
        content: "Getting a rank is not about studying 18 hours a day; it's about studying effectively. Every AIR 1 topper we've interviewed emphasizes 'Presentation Skills'. If you can't present what you know in ICAI's language, you lose the rank."
      },
      "gst revision": {
        title: "Fast-Track GST Revision for CA Exams",
        desc: "Summarized GST notes, latest amendments, and critical sections.",
        points: ["Input Tax Credit (ITC) Critical Rules", "Place of Supply - Practical Scenarios", "Time & Value of Supply", "Latest GST Circulars"],
        content: "GST is a dynamic subject. Every attempt brings new amendments that are high-probability questions. Our GST revision guide ensures you don't miss any critical notification that ICAI might test."
      }
    };

    const data = topicData[topic.toLowerCase()] || {
      title: `${topic} - Essential Guide for CA Aspirants`,
      desc: `Comprehensive resources and insights for ${topic} to help you clear CA Exams.`,
      points: [`Latest ${topic} Trends`, `Expert Analysis`, `Practice Questions`, `Topper Insights`],
      content: `This topic is a critical part of the CA curriculum. Mastery in ${topic} requires a mix of theoretical knowledge and practical application. In our test series, we cover this area with high-probability questions to ensure you are exam-ready.`
    };

    return (
      <div className="animate-fade-up">
        <PageHeader title={data.title} subtitle={data.desc} category="Trending Resource" onBack={onBack} />
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content Area */}
            <div className="lg:w-2/3 space-y-12">
              <section className="bg-white p-8 rounded-3xl border border-brand-primary/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Bookmark className="text-brand-orange" />
                  <h2 className="text-2xl font-display font-bold text-brand-dark">Overview & Context</h2>
                </div>
                <p className="text-brand-dark/70 text-lg leading-relaxed">
                  {data.content}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-10">
                  {data.points.map((p: string, i: number) => (
                    <div key={i} className="flex gap-3 items-center p-4 bg-brand-cream rounded-xl border border-brand-primary/5">
                      <CheckCircle2 size={18} className="text-brand-primary shrink-0" />
                      <span className="text-sm font-bold text-brand-dark">{p}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-brand-dark rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Star size={200} fill="white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Want more practice on {topic}?</h3>
                <p className="opacity-70 mb-8">Get exclusive access to our 2024 Question Bank and Mentorship for this specific topic.</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" onClick={() => onNavigate('pricing-detail')}>Join Test Series</Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Download Free Notes</Button>
                </div>
              </div>
            </div>
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