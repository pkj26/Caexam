import React from 'react';
import { Target, Eye, ShieldCheck, Award, GraduationCap, Users2, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface AboutUsProps {
  onDetail?: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onDetail }) => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "Providing the most accurate, ICAI-standard evaluation for CA aspirants nationwide.",
      color: "text-brand-primary",
      bg: "bg-brand-primary/10"
    },
    {
      icon: Eye,
      title: "Our Vision",
      desc: "To become the global standard for professional exam preparation.",
      color: "text-brand-orange",
      bg: "bg-brand-orange/10"
    }
  ];

  const expertise = [
    { icon: Award, text: "Evaluation by AIR Rankers only" },
    { icon: GraduationCap, text: "Strictly Qualified CAs" },
    { icon: ShieldCheck, text: "100% ICAI Pattern Alignment" },
    { icon: Users2, text: "1-on-1 Personalized Mentorship" }
  ];

  return (
    <section id="about" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
              Our Story
            </div>
            
            <h2 className="text-2xl md:text-4xl font-display font-bold text-brand-dark leading-tight">
              Empowering the Next Generation of <span className="text-brand-primary">Chartered Accountants</span>
            </h2>
            
            <p className="text-base text-brand-dark/70 leading-relaxed">
              Founded by a team of AIR rankers, CA Test Series was born out of a simple observation: students study hard but fail because of <strong>poor presentation</strong>.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">{item.title}</h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={onDetail} className="mt-2 !py-2.5 !px-5 text-xs">
              Learn More <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>

          {/* Right Side: Team Stats/Expertise */}
          <div className="lg:w-1/2 w-full">
            <div className="relative p-6 rounded-2xl bg-brand-cream border-2 border-brand-primary/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Award size={150} />
              </div>
              
              <h3 className="text-xl font-display font-bold text-brand-dark mb-4">Why Our Evaluation Team?</h3>
              
              <div className="grid grid-cols-1 gap-3 relative z-10">
                {expertise.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-brand-primary/5 hover:border-brand-primary/20 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <item.icon size={16} />
                    </div>
                    <span className="font-bold text-sm text-brand-dark">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-brand-dark rounded-xl text-white">
                <p className="text-xs font-medium opacity-70 mb-1">Cumulative Experience</p>
                <div className="text-2xl font-display font-bold text-brand-primary">15,000+ Hours</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};