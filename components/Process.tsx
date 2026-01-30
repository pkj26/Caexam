import React from 'react';
import { PenTool, Upload, FileSearch, Phone, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface ProcessProps {
  onDetail?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onDetail }) => {
  const steps = [
    { 
      icon: PenTool, 
      title: "Write Test", 
      desc: "Download question paper & write answers in exam conditions." 
    },
    { 
      icon: Upload, 
      title: "Upload Sheet", 
      desc: "Scan your answer sheet and upload it on our portal." 
    },
    { 
      icon: FileSearch, 
      title: "Get Evaluation", 
      desc: "Receive detailed feedback & marks within 48 hours." 
    },
    { 
      icon: Phone, 
      title: "Mentor Call", 
      desc: "1-on-1 call with CA ranker to discuss your mistakes." 
    },
  ];

  return (
    <section id="process" className="py-10 bg-brand-cream relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">
            How It <span className="text-brand-primary">Works</span>
          </h2>
          <p className="text-sm text-brand-dark/70">
            Simple 4-step process to improve your writing skills.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative mb-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-brand-primary/20 -z-10 transform scale-x-90"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white md:bg-transparent p-4 md:p-0 rounded-2xl shadow-sm md:shadow-none relative group">
              <div className="w-20 h-20 bg-white border-4 border-brand-cream rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:border-brand-primary transition-colors duration-300">
                <step.icon size={28} className="text-brand-primary group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold text-xs border-2 border-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">{step.title}</h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="!py-2 !px-4 text-xs" onClick={onDetail}>
            Read the detailed Evaluation Guide <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};