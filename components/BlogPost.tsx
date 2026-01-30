import React from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, CheckCircle2, Bookmark, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { BLOG_POSTS } from './Blog';
import { ViewType } from '../App';

interface BlogPostProps {
  id: string | null;
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ id, onBack, onNavigate }) => {
  const post = BLOG_POSTS.find(p => p.id === id) || BLOG_POSTS[0];

  return (
    <div className="bg-white min-h-screen">
      {/* Featured Header */}
      <div className="bg-brand-dark pt-24 pb-40 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-20 right-[-5%] w-96 h-96 bg-brand-primary rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-brand-primary font-bold hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} /> Knowledge Hub
          </button>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[1.1] mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <User size={18} />
              </div>
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center gap-2"><Calendar size={16} /> {post.date}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Post Content */}
          <div className="lg:w-2/3 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-50">
            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-xl text-brand-dark/70 italic leading-relaxed mb-10 border-l-4 border-brand-primary pl-6">
                "{post.summary}"
              </p>

              <h2 className="text-2xl font-display font-black text-brand-dark mt-12 mb-6">The Importance of Planned Revision</h2>
              <p className="text-brand-dark/70 leading-relaxed mb-8">
                Clearing CA exams is not just about studying; it is about how much you can recall in those 3 hours. For subjects like Audit or Law, a massive syllabus needs to be condensed into short notes. If you haven't planned your last 1.5 days, you are already behind.
              </p>

              <div className="bg-brand-cream rounded-3xl p-8 mb-8 border border-brand-primary/10">
                <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <Bookmark className="text-brand-primary" size={20} /> Key Takeaways
                </h3>
                <ul className="space-y-4">
                  {[
                    "Focus on Professional Ethics & Company Audit (40 Marks fixed)",
                    "Solve at least 2 full mock test papers before exams",
                    "Use Mnemonics for Standards on Auditing (SA)",
                    "Audit is all about Keywords - ICAI checks specifically for them"
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-brand-dark/80 font-bold">
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-display font-black text-brand-dark mt-12 mb-6">Mastering the 'ICAI Language'</h2>
              <p className="text-brand-dark/70 leading-relaxed mb-8">
                Many students write answers in general English. However, ICAI expects "Audit terminology". Instead of saying 'He didn't check the bills', write 'The auditor failed to obtain sufficient appropriate audit evidence'. This shift in language is the difference between a 35 and a 60.
              </p>

              <img src={post.image} alt="Reading Material" className="w-full h-96 object-cover rounded-[2rem] my-12" />

              <h2 className="text-2xl font-display font-black text-brand-dark mt-12 mb-6">Conclusion</h2>
              <p className="text-brand-dark/70 leading-relaxed mb-12">
                Stay consistent, follow your schedule, and most importantly—get your answers evaluated by rankers who know what ICAI wants. Good luck!
              </p>
            </div>

            {/* Sharing Footer */}
            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Share Article</span>
                 <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Facebook size={18} /></button>
                    <button className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Twitter size={18} /></button>
                    <button className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center hover:scale-110 transition-transform"><Linkedin size={18} /></button>
                    <button className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Share2 size={18} /></button>
                 </div>
               </div>
               <button className="flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest hover:underline">
                 <MessageSquare size={16} /> 12 Comments
               </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Sidebar CTA */}
            <div className="bg-brand-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-primary/30">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ArrowRight size={120} className="-rotate-45" />
               </div>
               <h3 className="text-2xl font-display font-black mb-4 relative z-10 leading-tight">Practice makes you a Ranker.</h3>
               <p className="text-white/80 text-sm mb-8 relative z-10">Don't just read strategies, implement them in our AIR-evaluated mock tests.</p>
               <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white hover:text-brand-primary relative z-10" onClick={() => onNavigate('pricing-detail')}>
                 Explore Test Series
               </Button>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Trending Articles</h4>
               <div className="space-y-6">
                 {BLOG_POSTS.slice(0, 2).map(p => (
                   <div key={p.id} className="group cursor-pointer" onClick={() => window.location.reload()}>
                     <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">{p.category}</p>
                     <h5 className="font-bold text-brand-dark text-sm leading-snug group-hover:text-brand-primary transition-colors">{p.title}</h5>
                   </div>
                 ))}
               </div>
            </div>

            {/* Newsletter Mini */}
            <div className="bg-slate-50 rounded-[2rem] p-8">
               <h4 className="font-bold text-brand-dark mb-2">Weekly Ranker Tips</h4>
               <p className="text-xs text-brand-dark/50 mb-6">Join 12,000+ students getting exam updates.</p>
               <input type="email" placeholder="Email Address" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs mb-3 outline-none focus:border-brand-primary" />
               <button className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-black uppercase hover:bg-brand-primary transition-all">Subscribe</button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};