import React from 'react';
import { Users, BookOpen, Award, CheckCircle } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Active Students', value: '5,000+' },
    { icon: BookOpen, label: 'Papers Evaluated', value: '1.2 Lakh+' },
    { icon: Award, label: 'AIR Rankers', value: '150+' },
    { icon: CheckCircle, label: 'Success Rate', value: '87%' },
  ];

  return (
    <section className="bg-white border-y border-brand-primary/10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-2 p-2 bg-brand-cream rounded-full group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={20} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-brand-dark">{stat.value}</h3>
              <p className="text-xs font-medium text-brand-dark/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};