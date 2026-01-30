import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { ViewType } from '../App';

interface FooterProps {
  onNavigate?: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-brand-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home')}>
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black font-display text-lg">
                CA
              </div>
              <span className="font-display font-bold text-xl tracking-tighter">
                exam<span className="text-brand-primary">.online</span>
              </span>
            </div>
            <p className="text-brand-cream/60 text-sm leading-relaxed">
              India's most trusted AI-powered test series for CA aspirants. 
              We bridge the gap between preparation and presentation.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-primary hover:text-white transition-all"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-primary hover:text-white transition-all"><Twitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-primary hover:text-white transition-all"><Instagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-primary hover:text-white transition-all"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-brand-cream/60">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-brand-primary transition-colors flex items-center gap-2">Home</button></li>
              <li><button onClick={() => onNavigate?.('about-detail')} className="hover:text-brand-primary transition-colors flex items-center gap-2">About Us</button></li>
              <li><button onClick={() => onNavigate?.('test-series-detail')} className="hover:text-brand-primary transition-colors flex items-center gap-2">Test Series Catalog</button></li>
              <li><button onClick={() => onNavigate?.('pricing-detail')} className="hover:text-brand-primary transition-colors flex items-center gap-2">Plans & Pricing</button></li>
              <li><button onClick={() => onNavigate?.('process-detail')} className="hover:text-brand-primary transition-colors flex items-center gap-2">How it Works</button></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-bold text-base mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-sm text-brand-cream/60">
              <li><button className="hover:text-brand-primary transition-colors">FAQs</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-brand-primary transition-colors">Refund Policy</button></li>
              <li><button onClick={() => onNavigate?.('student-login')} className="hover:text-brand-primary transition-colors font-bold text-brand-primary">Student Login</button></li>
              <li><button onClick={() => onNavigate?.('admin-login')} className="hover:text-brand-primary transition-colors text-white/30">Admin Login</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-base mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-brand-cream/60">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <span>123, CA Hub Tower, Laxmi Nagar,<br/>New Delhi - 110092</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-primary shrink-0" />
                <span>support@caexam.online</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-cream/40">
            &copy; {new Date().getFullYear()} CA Exam Online. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-brand-cream/40">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for Future CAs
          </div>
        </div>
      </div>
    </footer>
  );
};