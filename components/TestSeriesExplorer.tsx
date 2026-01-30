import React, { useState } from 'react';
import { BookOpen, FileText, Calendar, ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { Button } from './Button';

type Level = 'foundation' | 'inter' | 'final';
type Group = 'g1' | 'g2';

interface Subject {
  name: string;
  code: string;
  desc: string;
}

export const TestSeriesExplorer: React.FC<{ onDetail?: () => void }> = ({ onDetail }) => {
  const [activeLevel, setActiveLevel] = useState<Level>('inter');
  const [activeGroup, setActiveGroup] = useState<Group>('g1');

  const syllabusData: Record<Level, Record<Group | 'full', Subject[]>> = {
    foundation: {
      full: [
        { code: 'P1', name: 'Accounting', desc: 'Basics of accounting.' },
        { code: 'P2', name: 'Business Laws', desc: 'Regulatory Framework.' },
        { code: 'P3', name: 'Quant. Aptitude', desc: 'Maths, LR & Stats.' },
        { code: 'P4', name: 'Economics', desc: 'Micro/Macro Economics.' },
      ],
      g1: [], g2: [], 
    },
    inter: {
      g1: [
        { code: 'P1', name: 'Adv. Accounting', desc: 'AS & Special Accounts.' },
        { code: 'P2', name: 'Corporate Laws', desc: 'Companies Act & LLP.' },
        { code: 'P3', name: 'Taxation', desc: 'Income Tax & GST.' },
      ],
      g2: [
        { code: 'P4', name: 'Cost Accounting', desc: 'Costing & Budgetary.' },
        { code: 'P5', name: 'Auditing', desc: 'Nature of Audit & Stds.' },
        { code: 'P6', name: 'FM & SM', desc: 'Financial & Strategic Mgmt.' },
      ],
      full: []
    },
    final: {
      g1: [
        { code: 'P1', name: 'Fin. Reporting', desc: 'Ind AS & Integrated Rpt.' },
        { code: 'P2', name: 'AFM', desc: 'Derivatives & Forex.' },
        { code: 'P3', name: 'Adv. Auditing', desc: 'Quality Control & Audits.' },
      ],
      g2: [
        { code: 'P4', name: 'Direct Tax', desc: 'International Taxation.' },
        { code: 'P5', name: 'Indirect Tax', desc: 'GST, Customs & FTP.' },
        { code: 'P6', name: 'IBS', desc: 'Case Study Solutions.' },
      ],
      full: []
    }
  };

  const currentSubjects = activeLevel === 'foundation' 
    ? syllabusData.foundation.full 
    : syllabusData[activeLevel][activeGroup];

  return (
    <section id="explorer" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-2">
            <Layers size={12} /> Syllabus Coverage
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-brand-dark">
            Explore <span className="text-brand-blue">Test Series</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-brand-cream rounded-xl p-3 sticky top-24 border border-brand-blue/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-2 px-2">Select Level</h4>
              <nav className="space-y-1">
                {(['foundation', 'inter', 'final'] as Level[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-xs transition-all ${
                      activeLevel === lvl 
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                      : 'text-brand-dark/60 hover:bg-white hover:text-brand-blue'
                    }`}
                  >
                    <span className="capitalize">{lvl}</span>
                    <ChevronRight size={14} className={activeLevel === lvl ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
              </nav>

              {activeLevel !== 'foundation' && (
                <div className="mt-4 pt-4 border-t border-brand-blue/10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-2 px-2">Choose Group</h4>
                  <div className="flex bg-white rounded-lg p-1 border border-brand-blue/5">
                    <button
                      onClick={() => setActiveGroup('g1')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${activeGroup === 'g1' ? 'bg-brand-blue text-white' : 'text-brand-dark/50 hover:bg-brand-cream'}`}
                    >
                      Group 1
                    </button>
                    <button
                      onClick={() => setActiveGroup('g2')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${activeGroup === 'g2' ? 'bg-brand-blue text-white' : 'text-brand-dark/50 hover:bg-brand-cream'}`}
                    >
                      Group 2
                    </button>
                  </div>
                </div>
              )}

              <Button variant="ghost" className="w-full mt-4 text-[10px] py-2" onClick={onDetail}>
                View All Details
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
              {currentSubjects.map((subject, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-100 hover:border-brand-blue/30 transition-all hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 bg-brand-cream rounded-lg flex items-center justify-center font-black text-brand-blue text-xs">
                      {subject.code}
                    </div>
                    <span className="text-[9px] font-bold text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded">New</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-blue transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-brand-dark/60 mb-4 leading-relaxed line-clamp-2">
                    {subject.desc}
                  </p>

                  <div className="flex gap-4 mb-4">
                    <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-brand-dark/70 hover:text-brand-blue transition-colors">
                      <FileText size={12} /> Sample Paper
                    </a>
                    <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-brand-dark/70 hover:text-brand-blue transition-colors">
                      <Calendar size={12} /> Schedule
                    </a>
                  </div>

                  <Button variant="outline" fullWidth className="text-[10px] !py-2 h-auto" onClick={onDetail}>
                    Full Details <ArrowRight size={12} className="ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};