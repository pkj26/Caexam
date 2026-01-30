import React from 'react';
import { Star, MessageCircle } from 'lucide-react';

export const StudentTestimonials: React.FC = () => {
  const reviews = [
    {
      name: "Aman Gupta",
      result: "AIR 04 (CA Final)",
      quote: "The test papers were incredibly challenging, mirroring the ICAI standard. The evaluation didn't just give marks but showed me how to structure my answers for maximum impact.",
      avatarColor: "bg-blue-500"
    },
    {
      name: "Ishita Shah",
      result: "Cleared Both Groups",
      quote: "I was failing in Audit repeatedly. Their specific feedback on keywords and SA references helped me jump from 32 to 64 marks.",
      avatarColor: "bg-purple-500"
    },
    {
      name: "Karan Mehta",
      result: "AIR 21 (CA Inter)",
      quote: "Best platform for CA students. The UI is clean, and uploading answer sheets is seamless. The detailed feedback within 48 hours kept my momentum going.",
      avatarColor: "bg-brand-primary"
    },
    {
      name: "Riya Kapoor",
      result: "Cleared Group 1",
      quote: "Focusing on DT and International Tax was easier with their targeted chapter-wise tests. They really catch the small presentation errors.",
      avatarColor: "bg-brand-orange"
    }
  ];

  return (
    <section id="student-reviews" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-2">
            <MessageCircle size={12} /> Student Voices
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">
            What Our <span className="text-brand-primary">Students</span> Say
          </h2>
          <p className="text-sm text-brand-dark/70 max-w-2xl mx-auto">
            Real feedback from aspirants who turned their hard work into success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="group p-5 rounded-2xl bg-brand-cream border border-brand-primary/5 hover:border-brand-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={12} className="fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <p className="text-brand-dark/80 text-xs leading-relaxed mb-4 italic">
                  "{review.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-2 pt-3 border-t border-brand-primary/10">
                <div className={`w-8 h-8 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-brand-dark leading-none">{review.name}</h4>
                  <p className="text-[10px] font-bold text-brand-primary mt-0.5">{review.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-brand-dark/50">
            Average Rating: <span className="text-brand-dark font-bold">4.9/5</span> based on 2,400+ reviews
          </p>
        </div>
      </div>
    </section>
  );
};