import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShieldCheck, ClipboardCheck, User, Phone, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  const [liveCount, setLiveCount] = useState(Math.floor(Math.random() * (290 - 275 + 1)) + 275);
  const [formData, setFormData] = useState({ name: '', mobile: '', course: 'CA Final' });
  
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(350); 

  const rotatingTexts = ["CA Final", "CA Intermediate", "CA Foundation"];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const upChance = Math.random() > 0.4;
        const step = upChance ? 1 : -1;
        let next = prev + step;
        if (next > 290) next = 289;
        if (next < 275) next = 276;
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentFullText = rotatingTexts[textIndex];
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        setTypingSpeed(350); 
        if (displayedText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        setTypingSpeed(150); 
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        }
      }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex, typingSpeed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks ${formData.name}! We will send the ${formData.course} trial paper to ${formData.mobile} shortly.`);
  };

  return (
    <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden bg-brand-cream">
      {/* Background Aesthetic Layers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1E40AF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center animate-fade-up">
          
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-brand-primary/10 shadow-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
              <span className="font-black text-brand-primary">{liveCount}</span> Students Practicing Now
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-brand-dark leading-[1.05] mb-8">
            Crack <br/>
            <span className="relative inline-flex items-center">
              <span className="font-hand text-brand-orange text-5xl md:text-8xl lg:text-9xl whitespace-nowrap drop-shadow-sm">
                {displayedText}
              </span>
              <span className="w-1.5 h-12 md:h-16 lg:h-24 bg-brand-orange ml-3 animate-pulse"></span>
            </span>
            <br/>
            <span className="relative z-10">in First Attempt.</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-dark/60 font-medium leading-relaxed mb-12 max-w-2xl">
            India's most trusted test series where your answer sheets are evaluated by <span className="text-brand-dark font-bold underline decoration-brand-orange decoration-2 underline-offset-4">AIR Rankers</span> within 48 hours. Built for the ICAI New Scheme.
          </p>

          {/* Integrated Lead Form - Centered */}
          <div className="w-full max-w-[540px] mb-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border border-white p-2">
              <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-10">
                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 mb-2">
                    <ClipboardCheck size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-dark">Try Free Evaluation</h3>
                  <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[0.2em]">Detailed Feedback from AIR Rankers</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="text" placeholder="Full Name" required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="tel" placeholder="WhatsApp No." required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                      value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                  <div className="relative sm:col-span-2">
                    <select 
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer text-brand-dark focus:ring-4 focus:ring-brand-primary/5 transition-all"
                      value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})}
                    >
                      <option>CA Final</option><option>CA Intermediate</option><option>CA Foundation</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/30 pointer-events-none" size={18} />
                  </div>
                  <Button type="submit" variant="blue" className="sm:col-span-2 !py-4 !rounded-2xl !text-base shadow-xl shadow-brand-blue/20">
                    Get Free Trial Paper
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Social Proof Footer - Centered */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-cream bg-slate-200 shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+60}`} alt="Student" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-brand-orange text-brand-orange" />)}
              </div>
              <p className="text-sm font-bold text-brand-dark/60"><span className="text-brand-dark font-black">4.9/5 Rating</span> from 5,000+ CA Aspirants</p>
            </div>
          </div>

          {/* Centered Success Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 border-t border-brand-primary/10 pt-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-brand-dark/40 tracking-widest">Pass Rate</p>
                <p className="text-sm font-black text-brand-dark">87% Success</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-brand-dark/40 tracking-widest">Security</p>
                <p className="text-sm font-black text-brand-dark">100% Privacy</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};