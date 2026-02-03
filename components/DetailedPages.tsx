import React from 'react';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Users, Target, 
  BookCheck, ClipboardList, Info, GraduationCap, Star, 
  Share2, Download, FileText, ChevronRight, Bookmark, 
  BookOpen, Layers, Award, Check, Zap, Lightbulb, 
  TrendingUp, HelpCircle, Eye, Shield, Globe, Clock, PenTool, Upload, Phone
} from 'lucide-react';
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
          <ArrowLeft size={20} /> Back to Home
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
  
  const AboutDetail = () => (
    <div className="animate-fade-up">
      <PageHeader 
        title="About Exam.Online" 
        subtitle="The story of how we became India's most trusted platform for CA aspirants." 
        category="Company" 
        onBack={onBack} 
      />
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="prose prose-slate prose-lg max-w-none space-y-12">
          <section>
            <h2 className="text-3xl font-display font-bold text-brand-dark">Our Mission & Vision</h2>
            <p className="text-brand-dark/70 text-lg leading-relaxed">
              Founded by a team of All India Rankers (AIR), Exam.Online was born out of a simple observation: <strong>knowledge is common, but presentation is rare.</strong> Most CA students fail not because they don't know the answers, but because they don't know how to present them according to ICAI standards.
            </p>
            <p className="text-brand-dark/70 text-lg leading-relaxed">
              Our mission is to provide every student in India, regardless of their location, access to high-quality evaluation by experts who have already mastered the CA exams.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Trust", desc: "100% AIR evaluation with no exceptions." },
              { icon: Target, title: "Accuracy", desc: "Evaluation based on ICAI marking schemes." },
              { icon: Zap, title: "Speed", desc: "48-hour results to keep your momentum high." }
            ].map((item, i) => (
              <div key={i} className="bg-brand-cream p-6 rounded-3xl border border-brand-primary/10">
                <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center mb-4"><item.icon size={20} /></div>
                <h3 className="font-bold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-dark/60">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="bg-brand-dark text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10"><Award size={200} /></div>
            <h2 className="text-2xl font-display font-bold mb-4">Our Evaluation Standard</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              We don't use junior staff or unqualified interns. Every copy submitted to us goes through a rigorous two-step check by a qualified Chartered Accountant and is cross-verified by an AIR holder.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-slate-300" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+20})`, backgroundSize: 'cover'}}></div>)}
               </div>
               <span className="text-xs font-bold text-brand-primary">150+ Expert Evaluators</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const ProcessDetail = () => (
    <div className="animate-fade-up">
      <PageHeader 
        title="Our Evaluation Process" 
        subtitle="A deep dive into how your papers are evaluated and how to get the most out of it." 
        category="Student Guide" 
        onBack={onBack} 
      />
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { icon: PenTool, title: "1. Attempt the Test", desc: "Download our ICAI-standard question papers. Write your answers on physical sheets in exam conditions to simulate the real stress.", points: ["Use only black pen", "Follow ICAI formatting", "Strict time limits"] },
            { icon: Upload, title: "2. High-Quality Scan", desc: "Scan your sheets using a mobile app. Ensure every word is legible for the evaluator to provide accurate feedback.", points: ["Convert to single PDF", "Clear images", "Vertical orientation"] },
            { icon: FileText, title: "3. Professional Evaluation", desc: "Our CA experts check every single word. We look for keywords, section references, and step-wise calculations.", points: ["ICAI Marking Scheme", "Step-wise analysis", "Keyword identification"] },
            { icon: Phone, title: "4. One-on-One Feedback", desc: "Once your result is out, book a call. Discuss your mistakes directly with an AIR ranker to understand why you lost marks.", points: ["15-min slots", "Topic discussion", "Strategy revision"] }
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-brand-primary/20 transition-all">
              <div className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/20">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-display font-bold text-brand-dark mb-4">{step.title}</h3>
              <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">{step.desc}</p>
              <ul className="space-y-2">
                {step.points.map((p, pi) => (
                  <li key={pi} className="flex items-center gap-2 text-xs font-bold text-brand-dark/40">
                    <CheckCircle2 size={14} className="text-brand-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 p-10 bg-brand-cream rounded-[3rem] border border-brand-primary/10 text-center">
          <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">Ready to start your first test?</h2>
          <p className="text-brand-dark/60 mb-8 max-w-xl mx-auto">Join the 12,000+ students who have improved their scores by average 15-20 marks using our evaluation methodology.</p>
          <Button onClick={() => onNavigate('pricing-detail')}>Choose a Plan</Button>
        </div>
      </div>
    </div>
  );

  const TopicDetail = () => {
    if (!topic) return <div className="p-20 text-center">Topic Not Found</div>;

    const topicData: Record<string, any> = {
      // (Keep existing topic data mapping...)
      "ind as 115 revenue": {
        title: "Ind AS 115: Revenue Control Model",
        category: "CA Final FR",
        intro: "Ind AS 115 replaces 'Risk & Reward' with 'Control'. It uses a standard 5-step process to recognize revenue.",
        diagram: {
          type: "flow",
          steps: [{label: "Contract"}, {label: "Obligations"}, {label: "Price"}, {label: "Allocation"}, {label: "Recognition"}]
        },
        keyPoints: ["Identify distinct performance obligations", "Estimate variable consideration", "Allocate transaction price", "Recognize over time or at point in time"]
      }
      // ... other topics as previously defined
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

  const PricingDetail = () => (
    <div className="animate-fade-up">
      <PageHeader 
        title="Plans & Pricing" 
        subtitle="Choose the best test series structure for your upcoming attempt." 
        category="Pricing" 
        onBack={onBack} 
      />
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { name: "Detailed Series", price: "1,999", features: ["12 Mock Tests", "Detailed Evaluation", "AIR Ranker Mentorship", "Valid till Exam"] },
            { name: "Unscheduled", price: "2,499", features: ["Unlimited Tests", "Self-Paced Submission", "Priority 24h Result", "Access to Library"] },
            { name: "Fast Track", price: "999", features: ["2 Full Mock Tests", "Keyword Analysis", "Summary Notes", "Group Mentorship"] }
          ].map((plan, i) => (
            <div key={i} className={`p-8 rounded-[3rem] border transition-all ${i === 1 ? 'bg-brand-dark text-white border-brand-primary shadow-2xl scale-105 relative z-10' : 'bg-white text-brand-dark border-slate-100'}`}>
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <div className="text-4xl font-black mb-8">₹{plan.price}</div>
              <ul className="space-y-4 mb-10">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium opacity-80">
                    <CheckCircle2 size={18} className="text-brand-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={i === 1 ? 'primary' : 'outline'} fullWidth onClick={() => onAddToCart({ id: `p-${i}`, name: plan.name, price: parseInt(plan.price.replace(',','')), originalPrice: 5000, type: 'Test Series' })}>
                Enroll Now
              </Button>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-[3rem] p-12 text-center border border-slate-200">
           <h3 className="text-2xl font-display font-bold text-brand-dark mb-4">Custom Bulk Orders</h3>
           <p className="text-slate-500 mb-8">Preparing in a group? Contact us for special corporate and student group discounts.</p>
           <Button variant="ghost">Contact Sales Team</Button>
        </div>
      </div>
    </div>
  );

  const pages: Record<string, React.ReactNode> = {
    'topic-detail': <TopicDetail />,
    'about-detail': <AboutDetail />,
    'process-detail': <ProcessDetail />,
    'pricing-detail': <PricingDetail />,
    'mentors-detail': <AboutDetail />, // Reusing About for simplicity or can create separate
    'student-login': <div className="p-20 text-center">Login Page Content Placeholder</div>
  };

  return (
    <div className="bg-white min-h-screen">
      {pages[view as keyof typeof pages] || pages['topic-detail']}
    </div>
  );
};