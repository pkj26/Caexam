import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, Users, ArrowRight, Download, FileText, Globe } from 'lucide-react';
import { Button } from './Button';
import { ViewType } from '../App';

interface CourseLandingProps {
  level: 'final' | 'inter' | 'foundation';
  onNavigate: (view: ViewType) => void;
  onAddToCart: (item: any) => void;
}

const COURSE_DATA = {
  final: {
    title: "CA Final Test Series",
    heroTitle: "Crack CA Final in First Attempt",
    heroDesc: "India's most rigorous test series for CA Final May/Nov 2024. Evaluated by AIR Rankers with focus on Ind AS, Audit, and DT amendments.",
    keywords: ["AIR Ranker Evaluation", "48h Result", "New Scheme 2024"],
    subjects: [
      { code: "P1", name: "Financial Reporting", type: "Full Analysis" },
      { code: "P2", name: "Adv. Financial Mgmt", type: "Formula Audit" },
      { code: "P3", name: "Adv. Auditing & Ethics", type: "Standard Audit" },
      { code: "P4", name: "Direct Tax Laws", type: "Amendment Focus" },
      { code: "P5", name: "Indirect Tax Laws", type: "GST Mastery" },
      { code: "P6", name: "Integrated Business Solutions", type: "Case Study" }
    ],
    image: "https://images.unsplash.com/photo-1454165833767-1396e26402e3?auto=format&fit=crop&q=80&w=1200"
  },
  inter: {
    title: "CA Inter Test Series",
    heroTitle: "Secure Your AIR in CA Intermediate",
    heroDesc: "Master the CA Intermediate syllabus with our comprehensive chapter-wise test series. Perfect for both G1 and G2 preparation.",
    keywords: ["Chapter-wise Tests", "Mentorship Calls", "100% ICAI Pattern"],
    subjects: [
      { code: "P1", name: "Advanced Accounting", type: "AS mastery" },
      { code: "P2", name: "Corporate Laws", type: "Section Practice" },
      { code: "P3", name: "Taxation", type: "Computation Skill" },
      { code: "P4", name: "Costing", type: "Problem Solving" },
      { code: "P5", name: "Auditing", type: "SA Focused" },
      { code: "P6", name: "FM & SM", type: "Concept Clear" }
    ],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200"
  },
  foundation: {
    title: "CA Foundation Test Series",
    heroTitle: "Build a Strong Base for Your CA Journey",
    heroDesc: "Focused test series for CA Foundation students. Special emphasis on MCQ accuracy and Law presentation skills.",
    keywords: ["MCQ Strategy", "Negative Marking Tips", "Law Writing"],
    subjects: [
      { code: "P1", name: "Accounting", type: "Conceptual" },
      { code: "P2", name: "Business Laws", type: "Writing Practice" },
      { code: "P3", name: "Quantitative Aptitude", type: "Speed Drill" },
      { code: "P4", name: "Business Economics", type: "MCQ Practice" }
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
  }
};

export const CourseLanding: React.FC<CourseLandingProps> = ({ level, onNavigate, onAddToCart }) => {
  const data = COURSE_DATA[level];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-brand-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src={data.image} alt="CA Exams" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-brand-primary font-bold hover:text-white mb-8 transition-colors text-sm"
            >
              <ArrowLeft size={18} /> Back to Main
            </button>
            <div className="flex gap-2 mb-6">
              {data.keywords.map(kw => (
                <span key={kw} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">{kw}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black text-white leading-[1.1] mb-8">
              {data.heroTitle}
            </h1>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              {data.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={() => onNavigate('pricing-detail')}>View {data.title} Plans</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Download Sample Paper</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-8 bg-brand-cream border-y border-brand-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "5,000+" },
              { label: "AIR Rankers", value: "150+" },
              { label: "Success Rate", value: "87%" },
              { label: "Papers Checked", value: "1.2L+" }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-display font-black text-brand-dark">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4">Complete Syllabus Coverage</h2>
            <p className="text-slate-500 max-w-2xl mx-auto italic">Every paper is designed according to the ICAI 2024 New Scheme Exam Pattern.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.subjects.map(sub => (
              <div key={sub.code} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-2xl transition-all group flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">{sub.code}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{sub.type}</span>
                   </div>
                   <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">{sub.name}</h3>
                   <div className="space-y-3 mb-8">
                      {["Full Syllabus Tests", "Chapter-wise Performance", "Step-wise Marking"].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                           <CheckCircle2 size={14} className="text-green-500" /> {f}
                        </div>
                      ))}
                   </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary group-hover:gap-3 transition-all">
                   View Schedule <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5"><Globe size={300} /></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Why CA Students Trust <br/><span className="text-brand-primary">CA Exam Online?</span></h2>
                  <div className="space-y-8">
                     {[
                        { title: "Checked by Qualified CAs Only", desc: "No junior staff. Every copy is checked by a person who has cleared the exam themselves." },
                        { title: "Detailed Feedback in 48 Hours", desc: "Don't wait for weeks. Get feedback while the concepts are fresh in your mind." },
                        { title: "1-on-1 Ranker Mentorship", desc: "Book calls with AIR rankers to discuss your specific presentation mistakes." }
                     ].map(feat => (
                        <div key={feat.title} className="flex gap-4">
                           <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                              <ShieldCheck className="text-brand-primary" size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">{feat.title}</h4>
                              <p className="text-sm text-white/50">{feat.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="bg-white rounded-[3rem] p-10 text-brand-dark shadow-2xl">
                     <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-brand-orange text-brand-orange" />)}
                     </div>
                     <p className="text-xl italic font-medium leading-relaxed mb-8">"I was failing in {level === 'final' ? 'Audit' : level === 'inter' ? 'Law' : 'Accounts'} repeatedly. The specific feedback on keywords helped me jump from 32 to 64 marks. Highly recommended for every CA aspirant."</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                        <div>
                           <p className="font-bold">Rahul Verma</p>
                           <p className="text-xs text-brand-primary font-bold uppercase">AIR 14 holder</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-brand-cream">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">Ready to secure your prefix?</h2>
            <p className="text-lg text-slate-500 mb-10">Join 12,000+ students already preparing for the {level.toUpperCase()} attempt with us.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button variant="primary" className="!py-4" onClick={() => onNavigate('pricing-detail')}>Join {data.title}</Button>
               <Button variant="outline" className="!py-4" onClick={() => onNavigate('home')}>Try Free Demo Paper</Button>
            </div>
         </div>
      </section>
    </div>
  );
};