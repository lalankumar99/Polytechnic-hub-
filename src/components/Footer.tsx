import React from 'react';
import { GraduationCap, Shield, FolderGit2, BookOpen, Layers, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'browse' | 'admin', folderId?: string | null) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer id="polytechnic-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white font-mono tracking-tight">POLYTECHNIC HUB</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Modern digital study library for Polytechnic diploma engineering students. High-quality PDFs, interactive HTML guides, solved question banks, and semester curriculum.
            </p>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free & Open Student Study Platform</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Study Branches</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('browse', 'f-electrical')} className="hover:text-cyan-400 transition-colors">
                  Electrical Engineering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-mechanical')} className="hover:text-cyan-400 transition-colors">
                  Mechanical Engineering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-civil')} className="hover:text-cyan-400 transition-colors">
                  Civil Engineering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-cse')} className="hover:text-cyan-400 transition-colors">
                  Computer Science & Engg
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-ece')} className="hover:text-cyan-400 transition-colors">
                  Electronics & Communication
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Study Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('browse', null)} className="hover:text-cyan-400 transition-colors">
                  Semester 1 to 6 Notes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-ee-s3-ecn-u1-imp')} className="hover:text-cyan-400 transition-colors">
                  Previous Year Questions (PYQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-ee-s3-ecn-u1')} className="hover:text-cyan-400 transition-colors">
                  Important Questions (VVI)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'f-cse-s3-dsa')} className="hover:text-cyan-400 transition-colors">
                  Interactive HTML Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Administration & Info</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenLogin} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>Admin Control Center</span>
                </button>
              </li>
              <li><span className="text-slate-500 hover:text-slate-300 cursor-pointer">About Platform</span></li>
              <li><span className="text-slate-500 hover:text-slate-300 cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-slate-500 hover:text-slate-300 cursor-pointer">Terms of Service</span></li>
              <li><span className="text-slate-500 hover:text-slate-300 cursor-pointer">Contact Library Support</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} POLYTECHNIC HUB. All Rights Reserved. Built for Polytechnic Diploma Students.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-400">English Only Interface</span>
            <span className="text-[11px] bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 px-2.5 py-1 rounded-md">Landscape Ready Reader</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
