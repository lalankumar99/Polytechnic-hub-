import React, { useState } from 'react';
import {
  BookOpen,
  FolderTree,
  Search,
  Shield,
  Menu,
  X,
  LogOut,
  SlidersHorizontal,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { AdminUser } from '../types';

interface HeaderProps {
  currentView: 'home' | 'browse' | 'admin';
  onNavigate: (view: 'home' | 'browse' | 'admin', folderId?: string | null) => void;
  adminUser: AdminUser | null;
  onOpenLogin: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  adminUser,
  onOpenLogin,
  onOpenSearch,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="polytechnic-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono">POLYTECHNIC</span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md">HUB</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">Digital Study Library & Notes</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              id="nav-browse-btn"
              onClick={() => onNavigate('browse', null)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-all ${
                currentView === 'browse'
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Browse Notes</span>
            </button>

            <button
              id="nav-search-btn"
              onClick={onOpenSearch}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center space-x-1.5 transition-all border border-transparent hover:border-slate-700"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">⌘K</kbd>
            </button>
          </nav>

          {/* Right Action / Admin Authentication */}
          <div className="hidden md:flex items-center space-x-3">
            {adminUser ? (
              <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-xl p-1 pl-3 shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">Admin</span>
                </div>

                <button
                  id="header-admin-dashboard-btn"
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    currentView === 'admin'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  id="header-admin-logout-btn"
                  onClick={onLogout}
                  title="Logout Admin"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-admin-login-btn"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors flex items-center space-x-1.5 border border-slate-700/60 cursor-pointer"
                title="Administration Access"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              id="mobile-search-btn"
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
            >
              <Search className="w-5 h-5 text-cyan-400" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-2 ${
              currentView === 'home' ? 'bg-blue-600/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onNavigate('browse', null);
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-2 ${
              currentView === 'browse' ? 'bg-blue-600/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Browse Library</span>
          </button>

          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search All Notes</span>
          </button>

          <div className="pt-2 border-t border-slate-800">
            {adminUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-bold bg-cyan-500 text-slate-950 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Admin Control Dashboard</span>
                  </span>
                  <span className="text-xs bg-slate-900/40 text-slate-950 px-2 py-0.5 rounded">Active</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4 text-cyan-200" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
