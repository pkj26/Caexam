import React from 'react';
import { Linkedin, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface MentorsProps {
  onDetail?: () => void;
}

export const Mentors: React.FC<MentorsProps> = ({ onDetail }) => {
  const mentors = [
    { name: "CA Rohit Sethi", rank: "AIR 14 (Final)", role: "Audit Expert", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "CA Neha Gupta", rank: "AIR 08 (Inter)", role: "Law Specialist", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "CA Amit Kumar", rank: "Ex-Big 4", role: "FR & SFM Mentor", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "CA Priya Sharma", rank: "AIR 45 (Final)", role: "Taxation Guru", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
  ];

  return (
    <section id="mentors" className="py-12 bg-brand-dark text-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
              Guided by the <span className="text-brand-primary">Best</span>
            </h2>
            <p className="text-brand-cream/70 text-sm">
              Our copies are evaluated only by Qualified CAs and AIR Rankers.
            </p>
          </div>
          <button 
            onClick={onDetail}
            className="text-brand-primary font-bold text-sm hover:text-brand-secondary transition-colors underline decoration-2 underline-offset-4"
          >
            View Detailed Profiles
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mentors.map((mentor, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <img src={mentor.img} alt={mentor.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" />
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{mentor.name}</h3>
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mt-0.5">{mentor.rank}</p>
                </div>
              </div>
              <p className="text-xs text-brand-cream/60 mb-3">{mentor.role}</p>
              <div className="h-px w-full bg-white/10 mb-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-cream/40">500+ Copies</span>
                <Linkedin size={14} className="text-brand-cream/40 hover:text-blue-400 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
           <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 !py-2.5 !px-5 text-xs" onClick={onDetail}>
              Meet our 50+ Qualified Evaluators <ArrowRight size={14} className="ml-2" />
           </Button>
        </div>
      </div>
    </section>
  );
};