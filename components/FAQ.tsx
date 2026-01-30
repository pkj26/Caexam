import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: "How much time does evaluation take?", a: "We guarantee evaluation within 48 hours of submission. If we delay, you get a 100% refund for that test." },
    { q: "Can I write the test anytime?", a: "Yes, for the Unscheduled Series, you can attempt the test anytime until the actual ICAI exams." },
    { q: "Do you provide suggested answers?", a: "Yes, detailed suggested answers with marking schemes are provided immediately after you submit your paper." },
    { q: "Is the syllabus based on new scheme?", a: "Absolutely. All our papers are strictly as per the latest ICAI New Scheme syllabus." },
    { q: "How does the mentorship call work?", a: "After your evaluation, you can book a 15-minute slot with a ranker to discuss your specific weaknesses." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-display font-bold text-brand-dark text-center mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-brand-dark text-sm">{faq.q}</span>
                {openIndex === index ? <ChevronUp size={16} className="text-brand-primary"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0 bg-white text-brand-dark/70 text-xs leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};