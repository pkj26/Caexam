import React from 'react';
import { Quote } from 'lucide-react';

export const Results: React.FC = () => {
  const testimonials = [
    { name: "Rahul Verma", rank: "AIR 12", score: "520/800", quote: "The evaluation was brutal but necessary. They pointed out presentation mistakes I didn't know I was making." },
    { name: "Sneha Reddy", rank: "AIR 34", score: "498/800", quote: "Mentorship calls helped me strategize my last 1.5 days revision. Highly recommended!" },
    { name: "Aditya Singh", rank: "Both Groups", score: "Pass", quote: "I failed twice before. This series helped me jump from 180 to 215 in Group 1." },
  ];

  return (
    <section id="results" className="py-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">
            Hall of <span className="text-brand-orange">Fame</span>
          </h2>
          <p className="text-sm text-brand-dark/70">Join the league of rankers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 relative">
              <Quote className="absolute top-4 right-4 text-brand-primary/20" size={30} />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold text-base">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-sm">{t.name}</h4>
                  <span className="text-[10px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded-full">{t.rank}</span>
                </div>
              </div>
              <p className="text-brand-dark/80 italic mb-3 text-xs leading-relaxed">"{t.quote}"</p>
              <div className="text-xs font-bold text-brand-orange">Score: {t.score}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};