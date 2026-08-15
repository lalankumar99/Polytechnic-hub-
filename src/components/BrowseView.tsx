import React, { useState, useMemo } from 'react';
import {
  Folder,
  FileText,
  Code,
  ChevronRight,
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Download,
  Eye,
  Maximize2,
  FolderOpen,
  Info,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StudyItem, ViewMode, SortOption, BreadcrumbItem } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';

interface BrowseViewProps {
  currentFolderId: string | null;
  items: StudyItem[];
  onOpenFolder: (folderId: string) => void;
  onNavigateBreadcrumb: (folderId: string | null) => void;
  onOpenFile: (file: StudyItem) => void;
  isAdmin?: boolean;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  currentFolderId,
  items,
  onOpenFolder,
  onNavigateBreadcrumb,
  onOpenFile,
  isAdmin = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  // Find current folder
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return items.find(i => i.id === currentFolderId) || null;
  }, [currentFolderId, items]);

  // Compute breadcrumbs path
  const breadcrumbs = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [{ id: null, name: 'Library' }];
    if (!currentFolderId) return crumbs;

    const pathList: BreadcrumbItem[] = [];
    let currId: string | null = currentFolderId;

    while (currId) {
      const found = items.find(i => i.id === currId);
      if (!found) break;
      pathList.unshift({ id: found.id, name: found.name });
      currId = found.parentId;
    }

    return [...crumbs, ...pathList];
  }, [currentFolderId, items]);

  // Filter children of current folder
  const currentChildren = useMemo(() => {
    return items.filter(item => {
      if (currentFolderId === null) {
        // Root items (parentId is null or parent doesn't exist)
        return item.parentId === null;
      }
      return item.parentId === currentFolderId;
    });
  }, [items, currentFolderId]);

  // Apply search query and sort
  const filteredItems = useMemo(() => {
    let result = [...currentChildren];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.unit && item.unit.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Folders always first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-desc':
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime();
        case 'size-desc':
          return (b.size || 0) - (a.size || 0);
        case 'size-asc':
          return (a.size || 0) - (b.size || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [currentChildren, searchQuery, sortOption]);

  const foldersList = filteredItems.filter(i => i.type === 'folder');
  const filesList = filteredItems.filter(i => i.type !== 'folder');

  return (
    <div id="polytechnic-browse-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* TOP CONTROLS & BREADCRUMB BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
          {currentFolderId && (
            <button
              id="browse-back-btn"
              onClick={() => {
                const parent = currentFolder ? currentFolder.parentId : null;
                onNavigateBreadcrumb(parent);
              }}
              className="mr-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1"
              title="Go to parent folder"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Back</span>
            </button>
          )}

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.id || 'root'}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <button
                  onClick={() => onNavigateBreadcrumb(crumb.id)}
                  className={`px-2 py-1 rounded-md transition-colors truncate max-w-[180px] sm:max-w-[260px] ${
                    isLast
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Folder Heading & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span>{currentFolder ? currentFolder.name : 'Polytechnic Digital Study Library'}</span>
            </h1>
            {currentFolder?.description && (
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentFolder.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>{foldersList.length} Folders</span>
            <span>•</span>
            <span>{filesList.length} Study Notes</span>
          </div>
        </div>

        {/* Search, Sort, and View Mode Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          
          {/* Filter in folder */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this folder..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Sort */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="date-desc">Newest Added</option>
                <option value="date-asc">Oldest Added</option>
                <option value="size-desc">Size (Large &rarr; Small)</option>
                <option value="size-asc">Size (Small &rarr; Large)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {searchQuery ? 'No matching items found' : 'This folder is empty'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? `No notes or subfolders match "${searchQuery}" in this directory.`
                : 'No study materials are available here yet. Check back soon or browse other semester folders.'}
            </p>
          </div>
          {currentFolderId && (
            <button
              onClick={() => onNavigateBreadcrumb(currentFolder?.parentId ?? null)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Previous Folder</span>
            </button>
          )}
        </div>
      )}

      {/* FOLDERS SECTION */}
      {foldersList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Folder className="w-4 h-4 text-blue-500" />
              <span>Folders & Branches ({foldersList.length})</span>
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {foldersList.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => onOpenFolder(folder.id)}
                  className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400/80 transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5 fill-blue-500/20 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {folder.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {folder.itemCount !== undefined ? `${folder.itemCount} items` : 'Open folder'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {foldersList.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => onOpenFolder(folder.id)}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Folder className="w-4 h-4 fill-blue-500/20 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 truncate block">
                        {folder.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 text-xs text-slate-500">
                    <span>{folder.itemCount !== undefined ? `${folder.itemCount} items` : 'Folder'}</span>
                    <span className="hidden sm:inline">{formatDate(folder.updatedAt || folder.createdAt)}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILES SECTION */}
      {filesList.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Study Notes & Resources ({filesList.length})</span>
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filesList.map((file) => {
                const isPdf = file.type === 'pdf';
                return (
                  <div
                    key={file.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top color indicator */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${isPdf ? 'bg-rose-500' : 'bg-emerald-500'}`} />

                    <div>
                      <div className="flex items-start space-x-3 mb-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isPdf
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {isPdf ? <FileText className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            isPdf
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {file.type.toUpperCase()}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {file.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {file.description || `Course study material for ${file.subject || file.branch || 'Polytechnic Engineering'}.`}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
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
                        className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 shadow-sm ${
                          isPdf
                            ? 'bg-slate-900 hover:bg-rose-600'
                            : 'bg-slate-900 hover:bg-emerald-600'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Open in Study Viewer</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {filesList.map((file) => {
                const isPdf = file.type === 'pdf';
                return (
                  <div
                    key={file.id}
                    className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {isPdf ? <FileText className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 truncate block">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatFileSize(file.size)} • {file.viewsCount || 0} views
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => onOpenFile(file)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors flex items-center space-x-1"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Read</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
