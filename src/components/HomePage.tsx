import React from 'react';
import {
  FolderTree,
  Search,
  BookOpen,
  FileText,
  Code,
  Zap,
  Cpu,
  Wrench,
  Compass,
  Laptop,
  Radio,
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Maximize2,
  FolderOpen
} from 'lucide-react';
import { StudyItem, LibraryStats } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';

interface HomePageProps {
  onNavigateBrowse: (folderId?: string | null) => void;
  onOpenSearch: () => void;
  onOpenFile: (file: StudyItem) => void;
  stats: LibraryStats | null;
  items: StudyItem[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateBrowse,
  onOpenSearch,
  onOpenFile,
  stats,
  items
}) => {
  // Recent published files
  const recentFiles = items
    .filter(i => i.type !== 'folder' && i.status === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Polytechnic Branches
  const branches = [
    {
      id: 'f-electrical',
      name: 'Electrical Engineering',
      code: 'EE',
      icon: Zap,
      color: 'from-amber-500 to-yellow-600',
      border: 'hover:border-amber-500/50',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Circuits, KCL/KVL, AC networks, machines, and measurements.'
    },
    {
      id: 'f-mechanical',
      name: 'Mechanical Engineering',
      code: 'ME',
      icon: Wrench,
      color: 'from-rose-500 to-red-600',
      border: 'hover:border-rose-500/50',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: 'Thermodynamics, heat engines, SOM, TOM, and manufacturing.'
    },
    {
      id: 'f-civil',
      name: 'Civil Engineering',
      code: 'CE',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      border: 'hover:border-emerald-500/50',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Advanced surveying, concrete tech, structural analysis, hydraulics.'
    },
    {
      id: 'f-cse',
      name: 'Computer Science & Engg',
      code: 'CSE',
      icon: Laptop,
      color: 'from-cyan-500 to-blue-600',
      border: 'hover:border-cyan-500/50',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      description: 'Data structures, algorithms, logic design, databases, networks.'
    },
    {
      id: 'f-ece',
      name: 'Electronics & Comm.',
      code: 'ECE',
      icon: Radio,
      color: 'from-indigo-500 to-purple-600',
      border: 'hover:border-indigo-500/50',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'Electronic devices, analog circuits, signals and microprocessors.'
    }
  ];

  // Popular Subjects cards
  const popularSubjects = [
    {
      name: 'Electrical Circuit & Network',
      branch: 'Electrical Engg',
      sem: 'Semester 3',
      icon: Zap,
      folderId: 'f-ee-s3-ecn',
      tags: ['KCL/KVL', 'Theorems', 'AC Circuits']
    },
    {
      name: 'Data Structures & Algorithms',
      branch: 'Computer Science',
      sem: 'Semester 3',
      icon: Code,
      folderId: 'f-cse-s3-dsa',
      tags: ['Trees', 'Sorting', 'Big-O']
    },
    {
      name: 'Applied Thermodynamics',
      branch: 'Mechanical Engg',
      sem: 'Semester 3',
      icon: Wrench,
      folderId: 'f-me-s3-thermo',
      tags: ['Carnot Cycle', 'Steam Tables', 'Entropy']
    },
    {
      name: 'Advanced Surveying & Levelling',
      branch: 'Civil Engg',
      sem: 'Semester 3',
      icon: Compass,
      folderId: 'f-ce-s3-survey',
      tags: ['Theodolite', 'Traversing', 'Total Station']
    }
  ];

  return (
    <div id="polytechnic-home-view" className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Glow ambient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Folder-Based Polytechnic Digital Study Library</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight font-sans">
            Your Polytechnic <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              Study Library
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Organized Notes, PDFs and Study Materials — All in One Place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-browse-btn"
              onClick={() => onNavigateBrowse(null)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              <span>Browse Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-search-btn"
              onClick={onOpenSearch}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search Materials</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-left">
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Total Folders</span>
              <span className="text-xl font-extrabold text-white font-mono">{stats?.totalFolders ?? 18}+</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Published PDFs</span>
              <span className="text-xl font-extrabold text-cyan-400 font-mono">{stats?.totalPdfs ?? 8}+</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Interactive Guides</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{stats?.totalHtmls ?? 4}+</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Total Reads</span>
              <span className="text-xl font-extrabold text-indigo-300 font-mono">{stats?.totalViews ?? 3400}+</span>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK BROWSE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Major Study Categories</h2>
            <p className="text-xs sm:text-sm text-slate-500">Select your diploma branch to explore semester folders and unit notes</p>
          </div>
          <button
            onClick={() => onNavigateBrowse(null)}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All Root Folders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {branches.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                onClick={() => onNavigateBrowse(b.id)}
                className={`bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${b.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${b.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${b.badge}`}>
                      {b.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {b.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                  <span>Explore Semesters</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SUBJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Featured Curriculum</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Popular Subjects & Unit Packs</h2>
            </div>
            <button
              onClick={() => onNavigateBrowse(null)}
              className="text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open Library Tree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularSubjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateBrowse(sub.folderId)}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold mb-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{sub.branch}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors leading-snug">
                      {sub.name}
                    </h3>
                    <span className="inline-block text-[11px] text-slate-400 mt-1">{sub.sem}</span>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {sub.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300 group-hover:text-cyan-300 font-semibold">
                    <span>Open Unit Folders</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECENT STUDY MATERIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Recent Study Materials</h2>
            <p className="text-xs sm:text-sm text-slate-500">Recently published lecture notes, PDFs, and interactive reference guides</p>
          </div>
          <button
            onClick={() => onNavigateBrowse(null)}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentFiles.map((file) => {
            const isPdf = file.type === 'pdf';
            return (
              <div
                key={file.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isPdf
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {isPdf ? <FileText className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          isPdf
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {file.type.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {file.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {file.description || `Comprehensive study notes for ${file.subject || file.branch || 'Polytechnic Engineering'}.`}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{file.viewsCount || 0} reads</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={() => onOpenFile(file)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Open in Study Viewer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY POLYTECHNIC APP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Engineered for Polytechnic Success</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Direct access to curriculum folders without distracting clutter or broken links</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Unlimited Folder Nesting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Branch &rarr; Semester &rarr; Subject &rarr; Unit &rarr; Topic hierarchy mirroring your syllabus with breadcrumb tracing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Landscape Study Viewer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimized reading viewport with zoom controls, page jumps, and landscape mode for clear mathematical circuit analysis.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Instant Admin Publishing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whenever faculty uploads notes or PYQs in the admin file manager, they become live for students across all devices instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
