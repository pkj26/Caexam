import React, { useState } from 'react';
import { Search, BookOpen, GraduationCap, Award, ChevronRight, Zap, Target, Book, Lightbulb } from 'lucide-react';
import { ViewType } from '../App';

export const TOPICS = [
  {
    id: 't1',
    name: "What is GST?",
    level: "CA Inter",
    subject: "Taxation",
    desc: "A simple guide to Goods and Services Tax and its impact.",
    complexity: "Basic"
  },
  {
    id: 't2',
    name: "What is Audit?",
    level: "CA Inter",
    subject: "Auditing",
    desc: "Understanding the role of an Auditor in the corporate world.",
    complexity: "Basic"
  },
  {
    id: 't3',
    name: "Ind AS 115 Revenue",
    level: "CA Final",
    subject: "Financial Reporting",
    desc: "5-Step model to recognize revenue simply explained.",
    complexity: "Advanced"
  },
  {
    id: 't4',
    name: "What is Dividend?",
    level: "CA Foundation",
    subject: "Economics",
    desc: "Why companies share their profits with you.",
    complexity: "Basic"
  },
  {
    id: 't5',
    name: "Standard Costing",
    level: "CA Inter",
    subject: "Costing",
    desc: "How to find the difference between actual and standard costs.",
    complexity: "Moderate"
  },
  {
    id: 't6',
    name: "Professional Ethics",
    level: "CA Final",
    subject: "Auditing",
    desc: "Rules every CA must follow to keep the profession proud.",
    complexity: "Moderate"
  }
];

interface TopicLibraryProps {
  onNavigate: (view: ViewType, id?: string) => void;
}

export const TopicLibrary: React.FC<TopicLibraryProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const levels = ['All', 'CA Foundation', 'CA Inter', 'CA Final'];

  const filteredTopics = TOPICS.filter(t => 
    (filter === 'All' || t.level === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-4">
            CA Encyclopedia
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-6">
            Topics Made <span className="text-brand-primary">Simple</span>
          </h1>
          <p className="text-brand-dark/60 text-lg max-w-2xl mx-auto">
            Complex concepts explained in layman terms with diagrams. The best resource for quick revisions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fade-up">
           <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {levels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filter === lvl ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-slate-400 hover:text-brand-primary'
                  }`}
                >
                  {lvl}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search topics (e.g. GST)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 outline-none text-sm font-bold"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Categories / Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTopics.map((topic, idx) => (
             <div 
               key={topic.id}
               onClick={() => onNavigate('topic-detail', topic.name)}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all cursor-pointer group animate-fade-up"
               style={{ animationDelay: `${idx * 0.05}s` }}
             >
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${topic.level === 'CA Final' ? 'bg-indigo-50 text-indigo-500' : topic.level === 'CA Inter' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-green-50 text-green-600'}`}>
                      {topic.level === 'CA Final' ? <Award size={24}/> : topic.level === 'CA Inter' ? <GraduationCap size={24}/> : <BookOpen size={24}/>}
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-300">{topic.complexity}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{topic.name}</h3>
                <p className="text-xs text-brand-dark/40 font-bold uppercase mb-4">{topic.subject}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-2">{topic.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary">
                   Read Explanation <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
             </div>
           ))}
        </div>

        {/* Educational CTA */}
        <div className="mt-20 p-12 bg-white rounded-[3rem] border-4 border-brand-cream shadow-xl flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center shrink-0">
              <Lightbulb size={40} className="text-brand-orange animate-bounce-slow" />
           </div>
           <div>
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Can't find a topic?</h3>
              <p className="text-slate-500 max-w-xl">Our rankers are updating the library daily. If you want a specific topic explained simply, request it on our WhatsApp community.</p>
           </div>
           <button className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-sm hover:bg-brand-primary transition-all ml-auto">Request Topic</button>
        </div>

      </div>
    </div>
  );
};