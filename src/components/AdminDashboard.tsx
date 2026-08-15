import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FileText,
  Code,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Move,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  RefreshCw,
  FolderPlus,
  Search,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  FileCode,
  Sparkles,
  AlertTriangle,
  X,
  Lock,
  Layers,
  FolderOpen
} from 'lucide-react';
import { StudyItem, LibraryStats, BreadcrumbItem } from '../types';
import { api } from '../services/api';
import { formatFileSize, formatDate } from '../utils/formatters';

interface AdminDashboardProps {
  onOpenFile: (file: StudyItem) => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenFile,
  onRefreshPublicData
}) => {
  const [items, setItems] = useState<StudyItem[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // File Manager Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'manager' | 'overview' | 'all-files'>('manager');

  // Modals state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateHtmlModal, setShowCreateHtmlModal] = useState(false);
  const [renameItem, setRenameItem] = useState<StudyItem | null>(null);
  const [moveItem, setMoveItem] = useState<StudyItem | null>(null);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState<StudyItem | null>(null);
  const [previewItem, setPreviewItem] = useState<StudyItem | null>(null);

  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderStatus, setNewFolderStatus] = useState<'published' | 'draft'>('published');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'published' | 'draft'>('published');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  const [htmlNoteName, setHtmlNoteName] = useState('');
  const [htmlNoteContent, setHtmlNoteContent] = useState('');
  const [htmlNoteStatus, setHtmlNoteStatus] = useState<'published' | 'draft'>('published');
  const [htmlNoteDesc, setHtmlNoteDesc] = useState('');

  const [renameValue, setRenameValue] = useState('');
  const [selectedDestinationFolder, setSelectedDestinationFolder] = useState<string | null>(null);

  // Load Admin tree
  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminTree();
      setItems(data.items);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefreshPublicData();
  };

  // Compute breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [{ id: null, name: 'Root (Polytechnic Library)' }];
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

  // Current folder's children
  const currentChildren = useMemo(() => {
    return items.filter(item => {
      if (currentFolderId === null) {
        return item.parentId === null;
      }
      return item.parentId === currentFolderId;
    });
  }, [items, currentFolderId]);

  // Filtered by search
  const filteredChildren = useMemo(() => {
    if (!searchQuery.trim()) return currentChildren;
    const q = searchQuery.toLowerCase().trim();
    return currentChildren.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q))
    );
  }, [currentChildren, searchQuery]);

  // Current folder object
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return items.find(i => i.id === currentFolderId) || null;
  }, [currentFolderId, items]);

  // All folders for Move Destination selection
  const allFolders = useMemo(() => {
    return items.filter(i => i.type === 'folder');
  }, [items]);

  // Handlers
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await api.createFolder(newFolderName.trim(), currentFolderId, newFolderStatus, newFolderDesc);
      setShowNewFolderModal(false);
      setNewFolderName('');
      setNewFolderDesc('');
      triggerSuccess(`Folder "${newFolderName}" created successfully.`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Could not create folder');
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileObj) return;

    setUploading(true);
    try {
      await api.uploadFile(uploadFileObj, currentFolderId, uploadStatus, uploadDesc);
      setShowUploadModal(false);
      setUploadFileObj(null);
      setUploadDesc('');
      triggerSuccess(`File "${uploadFileObj.name}" uploaded successfully (${uploadStatus}).`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateHtmlNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlNoteName.trim() || !htmlNoteContent.trim()) return;

    try {
      await api.createHtmlNote(htmlNoteName.trim(), htmlNoteContent, currentFolderId, htmlNoteStatus, htmlNoteDesc);
      setShowCreateHtmlModal(false);
      setHtmlNoteName('');
      setHtmlNoteContent('');
      setHtmlNoteDesc('');
      triggerSuccess(`Interactive note "${htmlNoteName}" created successfully.`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Could not save HTML note');
    }
  };

  const handleTogglePublish = async (item: StudyItem) => {
    const newStatus = item.status === 'published' ? 'unpublished' : 'published';
    try {
      await api.updateItem(item.id, { status: newStatus });
      triggerSuccess(`Status updated to "${newStatus}" for "${item.name}".`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Status change failed');
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameItem || !renameValue.trim()) return;

    let finalName = renameValue.trim();
    // Maintain extension if renaming a file
    if (renameItem.type === 'pdf' && !finalName.toLowerCase().endsWith('.pdf')) {
      finalName = `${finalName}.pdf`;
    }
    if (renameItem.type === 'html' && !finalName.toLowerCase().endsWith('.html') && !finalName.toLowerCase().endsWith('.htm')) {
      finalName = `${finalName}.html`;
    }

    try {
      await api.updateItem(renameItem.id, { name: finalName });
      setRenameItem(null);
      setRenameValue('');
      triggerSuccess(`Item renamed to "${finalName}".`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Rename failed');
    }
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveItem) return;

    try {
      await api.updateItem(moveItem.id, { parentId: selectedDestinationFolder });
      setMoveItem(null);
      setSelectedDestinationFolder(null);
      triggerSuccess(`"${moveItem.name}" moved successfully.`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Move failed');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteItemConfirm) return;

    try {
      const res = await api.deleteItem(deleteItemConfirm.id);
      setDeleteItemConfirm(null);
      triggerSuccess(`Deleted ${res.count} item(s) successfully.`);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all folders and notes to the standard Polytechnic sample curriculum? Any custom uploads will be replaced.')) {
      return;
    }
    try {
      await api.resetDemo();
      triggerSuccess('Curriculum reset to default Polytechnic seed.');
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to reset data');
    }
  };

  return (
    <div id="polytechnic-admin-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Central Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Control & File Manager</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Polytechnic folders, upload PDFs/HTMLs, organize materials, and control public visibility.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="admin-reset-demo-btn"
            onClick={handleResetDemoData}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5"
            title="Reset library to default demo dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Curriculum</span>
          </button>
        </div>
      </div>

      {/* TOASTS / ALERTS */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 rounded-xl text-sm font-semibold flex items-center space-x-2 animate-fade-in shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/80 border border-rose-600 text-rose-300 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Folders</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{stats?.totalFolders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Files</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{stats?.totalFiles ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">PDF Notes</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">{stats?.totalPdfs ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">HTML Guides</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">{stats?.totalHtmls ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold block">Published (Public)</span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">{stats?.publishedCount ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-xs text-amber-700 font-semibold block">Drafts / Hidden</span>
          <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">{stats?.draftCount ?? 0}</span>
        </div>
      </div>

      {/* CLOUD FILE MANAGER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        
        {/* ACTION TOOLBAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center flex-wrap gap-1 text-xs font-semibold text-slate-600">
            {currentFolderId && (
              <button
                onClick={() => {
                  const parent = currentFolder ? currentFolder.parentId : null;
                  setCurrentFolderId(parent);
                }}
                className="mr-1.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1"
                title="Up one level"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Up</span>
              </button>
            )}

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id || 'root'}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                  <button
                    onClick={() => setCurrentFolderId(crumb.id)}
                    className={`px-2 py-1 rounded transition-colors ${
                      isLast
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Creation & Upload Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="admin-new-folder-btn"
              onClick={() => setShowNewFolderModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ New Folder</span>
            </button>

            <button
              id="admin-upload-file-btn"
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>+ Upload PDF / HTML</span>
            </button>

            <button
              id="admin-create-html-btn"
              onClick={() => setShowCreateHtmlModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>+ Write HTML Note</span>
            </button>
          </div>

        </div>

        {/* SEARCH BAR WITHIN MANAGER */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items in current directory..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* ITEMS LIST TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Size / Items</th>
                <th className="py-3 px-3">Last Modified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">This folder is empty</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Start by creating a subfolder or uploading PDF/HTML materials.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredChildren.map((item) => {
                  const isFolder = item.type === 'folder';
                  const isPdf = item.type === 'pdf';
                  const isPublished = item.status === 'published';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Name & Icon */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => {
                            if (isFolder) setCurrentFolderId(item.id);
                            else onOpenFile(item);
                          }}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isFolder
                              ? 'bg-blue-50 text-blue-600'
                              : isPdf
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {isFolder ? <Folder className="w-4 h-4 fill-blue-500/20" /> : isPdf ? <FileText className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-3 font-mono uppercase text-[11px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isFolder
                            ? 'bg-blue-50 text-blue-700'
                            : isPdf
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title={`Click to ${isPublished ? 'Unpublish' : 'Publish to Students'}`}
                        >
                          {isPublished ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-600" />
                              <span>Draft / Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Size or Child count */}
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {isFolder ? `${item.itemCount ?? 0} items` : formatFileSize(item.size)}
                      </td>

                      {/* Last Modified */}
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(item.updatedAt || item.createdAt)}
                      </td>

                      {/* Action Menu */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Preview / Open */}
                          <button
                            onClick={() => {
                              if (isFolder) setCurrentFolderId(item.id);
                              else onOpenFile(item);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            title={isFolder ? 'Open Folder' : 'Preview Study Note'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Rename */}
                          <button
                            onClick={() => {
                              setRenameItem(item);
                              setRenameValue(item.name);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="Rename"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Move */}
                          <button
                            onClick={() => {
                              setMoveItem(item);
                              setSelectedDestinationFolder(item.parentId);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="Move to another folder"
                          >
                            <Move className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteItemConfirm(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW FOLDER (Unlimited Nesting) */}
      {/* ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Create New Folder</h3>
              </div>
              <button onClick={() => setShowNewFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Creating folder inside: <strong>{currentFolder ? currentFolder.name : 'Root Library'}</strong>
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Folder Name *</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Unit 3 - AC Circuits"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Optional Description</label>
                <input
                  type="text"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="e.g. Lecture slides, derivations and question sets"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Visibility</label>
                <select
                  value={newFolderStatus}
                  onChange={(e) => setNewFolderStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="published">Published (Instantly visible to students)</option>
                  <option value="draft">Draft (Admin only until reviewed)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPLOAD PDF / HTML */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Upload Study Material</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Upload target: <strong>{currentFolder ? currentFolder.name : 'Root Library'}</strong>
            </p>

            <form onSubmit={handleUploadFile} className="space-y-4">
              
              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-6 text-center bg-slate-50/50 cursor-pointer">
                <input
                  type="file"
                  id="admin-file-upload-input"
                  accept=".pdf,.html,.htm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileObj(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="admin-file-upload-input" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  {uploadFileObj ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-cyan-700">{uploadFileObj.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(uploadFileObj.size)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to select or drag and drop a PDF or HTML file</p>
                      <p className="text-[11px] text-slate-400 mt-1">Supported formats: .pdf, .html (Up to 50 MB)</p>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Topic Tags</label>
                <input
                  type="text"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="e.g. Unit 1 Solved Exam Notes & formulas"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Publish Status</label>
                <select
                  value={uploadStatus}
                  onChange={(e) => setUploadStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="published">Publish Immediately (Visible to students)</option>
                  <option value="draft">Save as Draft (Review in Admin first)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFileObj || uploading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md disabled:opacity-40 flex items-center space-x-1.5"
                >
                  {uploading ? <span>Uploading...</span> : <span>Upload File</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE HTML STUDY NOTE DIRECTLY */}
      {/* ========================================================================= */}
      {showCreateHtmlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Create Interactive HTML Study Note</h3>
              </div>
              <button onClick={() => setShowCreateHtmlModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHtmlNote} className="space-y-3 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Note Title *</label>
                <input
                  type="text"
                  value={htmlNoteName}
                  onChange={(e) => setHtmlNoteName(e.target.value)}
                  placeholder="e.g. Thevenin Theorem Interactive Guide.html"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">HTML Study Content *</label>
                <textarea
                  value={htmlNoteContent}
                  onChange={(e) => setHtmlNoteContent(e.target.value)}
                  placeholder="<h1>Title</h1><p>Notes explanation, formulas, tables...</p>"
                  rows={10}
                  required
                  className="w-full px-3.5 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateHtmlModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Save & Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: RENAME ITEM */}
      {/* ========================================================================= */}
      {renameItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Rename Item</h3>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1">New Name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRenameItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500"
                >
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: MOVE ITEM (Interactive folder selector) */}
      {/* ========================================================================= */}
      {moveItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Move “{moveItem.name}”</h3>
            <p className="text-xs text-slate-500">Select destination folder in the Polytechnic Library:</p>

            <form onSubmit={handleMoveSubmit} className="space-y-4">
              <select
                value={selectedDestinationFolder || ''}
                onChange={(e) => setSelectedDestinationFolder(e.target.value || null)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Root (Library Top Level)</option>
                {allFolders
                  .filter(f => f.id !== moveItem.id) // cannot move into itself
                  .map(f => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name} {f.branch ? `(${f.branch})` : ''}
                    </option>
                  ))}
              </select>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMoveItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500"
                >
                  Move Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteItemConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteItemConfirm.name}"</strong>?
              {deleteItemConfirm.type === 'folder' && (
                <span className="block mt-1 text-rose-600 font-semibold">
                  Warning: All nested subfolders and files inside this folder will also be permanently deleted.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteItemConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
