import React, { useState } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import { ViewType } from '../App';

export const BLOG_POSTS = [
  {
    id: '1',
    title: "How to Clear CA Final Audit in 1.5 Days Revision Strategy",
    summary: "Audit is considered one of the toughest papers. Learn the AIR-14 strategy to revise the entire syllabus in under 36 hours using high-quality keywords.",
    category: "CA Final",
    author: "CA Rohit Sethi",
    date: "Jan 28, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1454165833767-1396e26402e3?auto=format&fit=crop&q=80&w=800",
    tags: ["Audit", "Revision", "Final"]
  },
  {
    id: '2',
    title: "ICAI New Scheme 2024: Major Changes You Must Know",
    summary: "Confused about Self-Paced modules or Paper 6? We break down everything you need to know about the latest ICAI curriculum updates and exam patterns.",
    category: "ICAI Updates",
    author: "CA Neha Gupta",
    date: "Jan 25, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    tags: ["New Scheme", "ICAI", "2024"]
  },
  {
    id: '3',
    title: "The Art of Presentation: How to Write Law Answers for 60+ Marks",
    summary: "Law is not about knowing the sections, it's about presentation. Learn the 'Provision-Analysis-Conclusion' format used by AIR toppers in our test series.",
    category: "CA Inter",
    author: "CA Ishan Vyas",
    date: "Jan 20, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    tags: ["Law", "Presentation", "Inter"]
  },
  {
    id: '4',
    title: "Chapter-wise vs Full Syllabus Test Series: Which is better?",
    summary: "Deciding between cumulative tests or one-shot mock tests? Discover why chapter-wise testing is the secret weapon for CA Inter students.",
    category: "Strategy",
    author: "CA Amit Kumar",
    date: "Feb 02, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    tags: ["Test Series", "Strategy", "Preparation"]
  },
  {
    id: '5',
    title: "CA Foundation: Mastering Negative Marking in MCQ Papers",
    summary: "Economics and Stats can be scoring but negative marking is a trap. Tips to attempt 90+ questions safely in the CA Foundation June 2024 attempt.",
    category: "CA Foundation",
    author: "CA Priya Sharma",
    date: "Feb 05, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    tags: ["Foundation", "MCQ", "Maths"]
  },
  {
    id: '6',
    title: "Balancing CA Final Preparation with 10 Hours of Articleship",
    summary: "Articleship is demanding, but clearing CA Final in first attempt is possible. A step-by-step roadmap for working students by an AIR holder.",
    category: "CA Final",
    author: "CA Rohit Sethi",
    date: "Feb 08, 2024",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    tags: ["Articleship", "Time Management", "Final"]
  },
  {
    id: '7',
    title: "Why 48-Hour Evaluation is Critical for CA Prep",
    summary: "Waiting weeks for test results kills momentum. Explore how our rapid evaluation system helps you fix mistakes while the concept is still fresh.",
    category: "Strategy",
    author: "CA Neha Gupta",
    date: "Feb 10, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    tags: ["Evaluation", "Feedback", "Mock Test"]
  },
  {
    id: '8',
    title: "Top 10 Amendments for Indirect Tax (GST) - May/June 2024",
    summary: "Don't lose easy marks! We've compiled the most important GST amendments that ICAI is highly likely to ask in the upcoming attempt.",
    category: "ICAI Updates",
    author: "CA Priya Sharma",
    date: "Feb 12, 2024",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    tags: ["GST", "Amendments", "Tax"]
  },
  {
    id: '9',
    title: "Memory Techniques to Learn Standards on Auditing (SA)",
    summary: "Frustrated with forgetting SA numbers and names? Use these mnemonics and visualization techniques to memorize all Auditing standards.",
    category: "CA Inter",
    author: "CA Ishan Vyas",
    date: "Feb 14, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    tags: ["Audit", "Memory Tips", "Study Hacks"]
  }
];

interface BlogProps {
  onNavigate: (view: ViewType, id?: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'CA Final', 'CA Inter', 'CA Foundation', 'ICAI Updates', 'Strategy'];

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Ranker's Corner
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-6">
            Latest <span className="text-brand-primary">CA News</span> & Preparation Guides
          </h1>
          <p className="text-brand-dark/60 text-lg max-w-2xl mx-auto">
            The most exhaustive resource for CA Final, Inter, and Foundation students. Written by rankers to help you become one.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'bg-white text-brand-dark/50 hover:text-brand-primary border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by keywords (e.g. Audit, New Scheme)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500 group animate-fade-up flex flex-col"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              <div className="relative h-60 overflow-hidden" onClick={() => onNavigate('blog-post', post.id)}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer" />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-brand-dark/40 text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                </div>
                
                <h2 
                  className="text-xl font-display font-bold text-brand-dark mb-4 leading-tight group-hover:text-brand-primary transition-colors cursor-pointer min-h-[3.5rem]"
                  onClick={() => onNavigate('blog-post', post.id)}
                >
                  {post.title}
                </h2>
                
                <p className="text-brand-dark/60 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.summary}
                </p>
                
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-xs">
                      {post.author[3]}
                    </div>
                    <span className="text-xs font-bold text-brand-dark">{post.author}</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('blog-post', post.id)}
                    className="w-10 h-10 bg-slate-50 text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Bottom Section */}
        <div className="mt-20 pt-16 border-t border-slate-100 grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-4">India's Best Resource for CA Aspirants</h3>
              <p className="text-sm text-brand-dark/60 leading-relaxed">
                Whether you are looking for <strong>CA Final Test Series</strong>, <strong>CA Inter Chapter-wise Mock Tests</strong>, or <strong>CA Foundation Sample Papers</strong>, our blog provides daily insights to keep you ahead. Our content is curated by All India Rankers who understand the nuances of ICAI evaluation.
              </p>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-brand-dark mb-4">Trending Tags</h4>
              <div className="flex flex-wrap gap-2">
                 {["#ICAIScheme2024", "#CAFinalAudit", "#GSTAmendments", "#CATopperTips", "#ExamPresentation", "#RankerStrategy", "#MockTests", "#AIRRanker"].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-full hover:bg-brand-primary/10 hover:text-brand-primary transition-colors cursor-pointer">{tag}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-20 p-12 bg-brand-dark rounded-[3rem] text-white relative overflow-hidden text-center animate-fade-up">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Tag size={200} className="rotate-12" />
           </div>
           <h2 className="text-3xl font-display font-bold mb-4 relative z-10">Never miss an ICAI update.</h2>
           <p className="text-white/60 mb-8 max-w-xl mx-auto relative z-10">Get the latest ICAI news and ranker revision notes delivered straight to your WhatsApp.</p>
           <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <input type="tel" placeholder="Your WhatsApp Number" className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 w-full sm:w-72 font-bold text-sm" />
              <button className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm hover:bg-brand-blue transition-all shadow-xl">Join 12k+ Students</button>
           </div>
        </div>

      </div>
    </div>
  );
};