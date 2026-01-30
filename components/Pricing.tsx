import React, { useState } from 'react';
import { Star, ShoppingBag, Zap, Users, BookText, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface PricingProps {
  plans: any[];
  onDetail?: () => void;
  onAddToCart: (item: any) => void;
}

export const Pricing: React.FC<PricingProps> = ({ plans, onDetail, onAddToCart }) => {
  const [course, setCourse] = useState('foundation');

  const getPriceMultiplier = () => {
    switch(course) {
      case 'foundation': return 0.5;
      case 'inter': return 0.8;
      default: return 1;
    }
  };

  const handleAddToCart = (plan: any) => {
    const finalPrice = Math.round(plan.priceBase * getPriceMultiplier());
    const itemToAdd = {
      id: `${plan.id}-${course}`,
      name: `${plan.name} - CA ${course.charAt(0).toUpperCase() + course.slice(1)}`,
      price: finalPrice,
      originalPrice: Math.round(finalPrice * 1.5),
      type: 'Test Series'
    };
    onAddToCart(itemToAdd);
  };

  return (
    <section id="pricing" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-brand-dark">
              Available <span className="text-brand-primary">Test Series</span>
            </h2>
            <p className="text-brand-dark/40 text-sm mt-1 font-medium">Updated for ICAI New Scheme 2024</p>
          </div>

          <div className="bg-brand-cream p-1 rounded-xl flex border border-brand-primary/10">
            {['foundation', 'inter', 'final'].map((c) => (
              <button
                key={c}
                onClick={() => setCourse(c)}
                className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  course === c 
                  ? 'bg-brand-dark text-white shadow-lg' 
                  : 'text-brand-dark/50 hover:bg-white'
                }`}
              >
                CA {c}
              </button>
            ))}
          </div>
        </div>

        {/* Updated Pricing Cards following Screenshot Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const finalPrice = Math.round(plan.priceBase * getPriceMultiplier());
            const isPopular = index === 1;

            return (
              <div 
                key={index} 
                className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-300"
              >
                {/* Header Image Section - flyer style */}
                <div className="p-4">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-inner">
                    <img 
                      src={plan.image} 
                      alt={plan.name} 
                      className="w-full h-full object-cover"
                    />
                    {/* Visual Overlay mimicking Flyer Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                       <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded text-[8px] font-black uppercase text-brand-primary">Batch 2024-25</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-6 pb-8 pt-2 flex-1 flex flex-col">
                  {/* Meta Icons Row */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-brand-primary">
                      <BookText size={16} />
                      <span className="text-[11px] font-bold text-slate-500">{plan.seriesCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-primary">
                      <Users size={16} />
                      <span className="text-[11px] font-bold text-slate-500">{plan.studentCount}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={14} className="fill-brand-orange text-brand-orange" />
                    ))}
                  </div>

                  {/* Title & Description */}
                  <div className="mb-6">
                    <h3 className="text-xl font-display font-black text-brand-dark mb-1 leading-tight group-hover:text-brand-primary transition-colors">
                      {plan.name} Series
                    </h3>
                  </div>

                  {/* Features List - Bullet Style from screenshot */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Price Section */}
                  <div className="mb-6">
                    <span className="text-3xl font-display font-black text-brand-primary">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-300 ml-2 line-through">
                      ₹{Math.round(finalPrice * 1.5).toLocaleString()}
                    </span>
                  </div>

                  {/* Action Button - Orange with Arrow */}
                  <button 
                    onClick={() => handleAddToCart(plan)}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black text-sm py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Enroll Now 
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};