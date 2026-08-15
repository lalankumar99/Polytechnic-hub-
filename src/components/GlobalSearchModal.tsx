import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Folder,
  FileText,
  Code,
  X,
  ChevronRight,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Eye
} from 'lucide-react';
import { StudyItem } from '../types';
import { formatFileSize } from '../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StudyItem[];
  onSelectItem: (item: StudyItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem
}) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'html' | 'folder'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract unique branches
  const branches = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.branch) set.add(i.branch);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const results = useMemo(() => {
    if (!query.trim() && typeFilter === 'all' && branchFilter === 'all') {
      return items.slice(0, 8); // show popular initial items
    }

    const q = query.toLowerCase().trim();

    return items.filter(item => {
      // Type match
      if (typeFilter !== 'all') {
        if (typeFilter === 'folder' && item.type !== 'folder') return false;
        if (typeFilter === 'pdf' && item.type !== 'pdf') return false;
        if (typeFilter === 'html' && item.type !== 'html') return false;
      }

      // Branch match
      if (branchFilter !== 'all' && item.branch !== branchFilter) {
        return false;
      }

      // Query match
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesSubject = item.subject?.toLowerCase().includes(q);
        const matchesBranch = item.branch?.toLowerCase().includes(q);
        const matchesSem = item.semester?.toLowerCase().includes(q);
        const matchesUnit = item.unit?.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesSubject || matchesBranch || matchesSem || matchesUnit;
      }

      return true;
    });
  }, [items, query, typeFilter, branchFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, subjects, branches, units, formulas (e.g. KCL, DSA, Thermo)..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            {(['all', 'pdf', 'html', 'folder'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                  typeFilter === t
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Types' : t.toUpperCase()}
              </button>
            ))}
          </div>

          {branches.length > 0 && (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">All Branches</option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-800/60">
          {results.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <p className="text-sm font-semibold">No materials found matching your search</p>
              <p className="text-xs text-slate-500">Try searching for subjects, units, or branch keywords.</p>
            </div>
          ) : (
            results.map(item => {
              const isFolder = item.type === 'folder';
              const isPdf = item.type === 'pdf';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="p-3 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isFolder
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : isPdf
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isFolder ? <Folder className="w-5 h-5" /> : isPdf ? <FileText className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        {item.branch && <span>{item.branch}</span>}
                        {item.semester && <span>• {item.semester}</span>}
                        {item.subject && <span>• {item.subject}</span>}
                        {item.size > 0 && <span>• {formatFileSize(item.size)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 text-slate-400 group-hover:text-cyan-300">
                    <span className="text-xs font-semibold hidden sm:inline">Open</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Found {results.length} resources</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
