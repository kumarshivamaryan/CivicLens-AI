import React from 'react';
// Humne sirf wahi icons liye hain jo common hain aur crash nahi karte
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe,      // Website ke liye
  Info,       // About ke liye
  ShieldCheck, 
  ExternalLink,
  MessageCircle // Instagram/Facebook ke alternative ke liye
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* 1. Brand Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={28} />
            <span className="text-2xl font-bold text-white tracking-tight">
              CivicLens <span className="text-blue-500 uppercase text-xl">AI</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Advancing urban infrastructure through AI-powered citizen reporting. Dedicated to transparency and smarter city management.
          </p>
        </div>

        {/* 2. Platform Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/" className="hover:text-blue-400 flex items-center gap-1 transition">Report Issue <ExternalLink size={12}/></a></li>
            <li><a href="/dashboard" className="hover:text-blue-400 flex items-center gap-1 transition">Live Heatmap <ExternalLink size={12}/></a></li>
            <li><a href="/admin-control" className="hover:text-blue-400 transition">Admin Console</a></li>
          </ul>
        </div>

        {/* 3. Official Support */}
        <div>
          <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Contact Support</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-white font-medium italic">Toll-Free Helpline</p>
                <p>+91 1800-419-0000</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-white font-medium italic">Official Email</p>
                <p>support@civiclens.gov.in</p>
              </div>
            </li>
          </ul>
        </div>

        {/* 4. Connectivity */}
        <div>
          <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl hover:bg-blue-600 transition-all shadow-lg">
              <Globe size={20} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl hover:bg-blue-600 transition-all shadow-lg">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl hover:bg-blue-600 transition-all shadow-lg">
              <Info size={20} />
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest font-bold text-slate-600">
        <p>© {new Date().getFullYear()} CivicLens AI System. All Rights Reserved.</p>
        <p>Managed by Municipal Corporation, Jaipur.</p>
      </div>
    </footer>
  );
};

export default Footer;