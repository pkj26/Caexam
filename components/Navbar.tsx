import React, { useState } from 'react';
import { Menu, X, ChevronRight, ChevronDown, Book, GraduationCap, Award, Library, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { ViewType } from '../App';

interface NavbarProps {
  onNavigate: (view: ViewType) => void;
  currentView: ViewType;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: 'About Us', view: 'about-detail' as ViewType },
    { name: 'Process', view: 'process-detail' as ViewType },
    { name: 'Mentors', view: 'mentors-detail' as ViewType },
    { name: 'Pricing', view: 'pricing-detail' as ViewType },
  ];

  const testSeriesItems = [
    { name: 'CA Foundation', level: 'foundation', icon: Book },
    { name: 'CA Inter Group 1', level: 'inter-g1', icon: GraduationCap },
    { name: 'CA Inter Group 2', level: 'inter-g2', icon: GraduationCap },
    { name: 'CA Final Group 1', level: 'final-g1', icon: Award },
    { name: 'CA Final Group 2', level: 'final-g2', icon: Award },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Updated with Blue Accent */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-black font-display text-lg shadow-lg shadow-brand-blue/20">
              CA
            </div>
            <span className="font-display font-bold text-xl text-brand-dark tracking-tighter">
              exam<span className="text-brand-blue">.online</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsDropdownOpen(true)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors ${currentView === 'test-series-detail' ? 'text-brand-blue' : 'text-brand-dark/70 hover:text-brand-blue'}`}
              >
                About Test Series <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                onMouseLeave={() => setIsDropdownOpen(false)}
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-brand-blue/10 p-4 transition-all duration-300 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-3 px-2">Levels & Papers</div>
                  {testSeriesItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        onNavigate('test-series-detail');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-cream text-left transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-dark">{item.name}</p>
                        <p className="text-[10px] text-brand-dark/40 font-medium">New Scheme 2024</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-brand-blue/5">
                  <button 
                    onClick={() => onNavigate('test-series-detail')}
                    className="w-full text-center text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                  >
                    View Comprehensive Catalog
                  </button>
                </div>
              </div>
            </div>

            {navItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => onNavigate(item.view)}
                className={`text-sm font-bold transition-colors ${currentView === item.view ? 'text-brand-blue' : 'text-brand-dark/70 hover:text-brand-blue'}`}
              >
                {item.name}
              </button>
            ))}

            {/* Cart Icon */}
            <button 
              onClick={() => onNavigate('checkout')}
              className="relative p-2 text-brand-dark/70 hover:text-brand-blue transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-brand-orange text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm animate-bounce-slow">
                  {cartCount}
                </span>
              )}
            </button>

            <Button variant="blue" className="!py-2 !px-4 !text-xs ml-2" onClick={() => onNavigate('student-login')}>
              Student Login <ChevronRight size={14} className="ml-1" />
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden flex items-center gap-4" onClick={() => setIsOpen(!isOpen)}>
            <div className="relative" onClick={(e) => { e.stopPropagation(); onNavigate('checkout'); }}>
              <ShoppingBag size={24} className="text-brand-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-black flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            {isOpen ? <X size={24} className="text-brand-dark" /> : <Menu size={24} className="text-brand-dark" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-brand-blue/10 p-4 space-y-2 shadow-xl animate-fade-up max-h-[80vh] overflow-y-auto">
            <div className="py-2 px-2">
              <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-3">About Test Series</p>
              <div className="grid grid-cols-1 gap-1">
                {testSeriesItems.map((item) => (
                  <button 
                    key={item.name}
                    className="flex items-center gap-3 w-full text-left py-3 px-3 hover:bg-brand-cream rounded-xl transition-colors"
                    onClick={() => {
                      onNavigate('test-series-detail');
                      setIsOpen(false);
                    }}
                  >
                    <item.icon size={18} className="text-brand-blue" />
                    <span className="text-sm font-bold text-brand-dark">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-brand-blue/5 my-2"></div>

            {navItems.map((item) => (
              <button 
                key={item.name}
                className="block w-full text-left text-sm font-bold text-brand-dark py-3 px-3 hover:bg-brand-cream rounded-xl transition-colors"
                onClick={() => {
                  onNavigate(item.view);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4">
              <Button fullWidth variant="blue" onClick={() => { onNavigate('student-login'); setIsOpen(false); }}>Login / Sign Up</Button>
            </div>
        </div>
      )}
    </header>
  );
};