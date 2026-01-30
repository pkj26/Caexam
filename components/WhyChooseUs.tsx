import React from 'react';
import { ShieldCheck, Zap, Award, MessageSquare, CheckCircle, Target, Search } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      icon: Award,
      title: "AIR Ranker Evaluation",
      description: "Our copies are checked by India's top CA AIR Rankers.",
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      keyword: "Expert CA Mentors"
    },
    {
      icon: ShieldCheck,
      title: "100% ICAI Pattern Mirror",
      description: "Every question paper is strictly drafted as per the ICAI New Scheme 2024.",
      color: "text-blue-500",
      bg: "bg-blue-50",
      keyword: "ICAI New Syllabus"
    },
    {
      icon: Zap,
      title: "Fast 48-Hour Results",
      description: "Fastest turnaround time in the industry. Results within 48 hours, guaranteed.",
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
      keyword: "Quick Evaluation"
    },
    {
      icon: MessageSquare,
      title: "1-on-1 Coaching",
      description: "Talk to your evaluator through personalized mentorship calls.",
      color: "text-purple-500",
      bg: "bg-purple-50",
      keyword: "CA Mentorship"
    },
    {
      icon: Target,
      title: "Step-wise Marking",
      description: "Master the art of scoring with ICAI-style step-wise marking.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      keyword: "Score Maximization"
    },
    {
      icon: CheckCircle,
      title: "Topper Comparison",
      description: "Access AIR 1 and AIR 10 answer sheets to visualize the road to a rank.",
      color: "text-brand-dark",
      bg: "bg-brand-dark/5",
      keyword: "Topper Sheets"
    }
  ];

  return (
    <section id="why-choose-us" className="py-12 bg-white border-y border-brand-primary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
            <Search size={12} className="animate-pulse" /> India's Best
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4 leading-tight">
            Why We Are <span className="text-brand-primary">Trusted</span>
          </h2>
          <p className="text-base text-brand-dark/60 leading-relaxed max-w-2xl mx-auto">
            A <span className="text-brand-dark font-bold">result-oriented ecosystem</span> designed by rankers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-3xl bg-white border border-slate-100 hover:border-brand-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 relative"
            >
              <div className={`w-12 h-12 ${benefit.bg} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-500`}>
                <benefit.icon className={benefit.color} size={24} />
              </div>
              
              <h3 className="text-lg font-display font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-brand-dark/60 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};