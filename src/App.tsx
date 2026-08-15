import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { BrowseView } from './components/BrowseView';
import { AdminDashboard } from './components/AdminDashboard';
import { StudyViewer } from './components/StudyViewer';
import { ViewingRequirementModal } from './components/ViewingRequirementModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { api, authState } from './services/api';
import { StudyItem, LibraryStats, AdminUser } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'admin'>('home');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // Data
  const [publicItems, setPublicItems] = useState<StudyItem[]>([]);
  const [publicStats, setPublicStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => authState.getUser());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Search Modal
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Viewer & Requirement Flow
  const [selectedFileForRequirement, setSelectedFileForRequirement] = useState<StudyItem | null>(null);
  const [activeViewingFile, setActiveViewingFile] = useState<StudyItem | null>(null);
  const [initialFullscreenPref, setInitialFullscreenPref] = useState<boolean>(false);

  // Load public data
  const loadPublicData = useCallback(async () => {
    try {
      const [items, stats] = await Promise.all([
        api.getPublicTree(),
        api.getPublicStats()
      ]);
      setPublicItems(items);
      setPublicStats(stats);
    } catch (err) {
      console.error('Error fetching public library:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
    // Check existing auth token validity
    api.verifyAuth().then(user => {
      setAdminUser(user);
    });
  }, [loadPublicData]);

  // Global Keyboard Shortcuts (e.g. Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNavigate = (view: 'home' | 'browse' | 'admin', folderId: string | null = null) => {
    if (view === 'admin' && !adminUser) {
      setShowLoginModal(true);
      return;
    }
    setCurrentView(view);
    if (view === 'browse') {
      setCurrentFolderId(folderId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentView('browse');
    setCurrentFolderId(folderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When student clicks any PDF or HTML note -> trigger Requirement Screen
  const handleInitiateOpenFile = (file: StudyItem) => {
    setSelectedFileForRequirement(file);
  };

  // When user clicks "Open Full Screen & Landscape" or "Continue Standard"
  const handleProceedToViewer = (preferFullscreen: boolean) => {
    if (!selectedFileForRequirement) return;
    const fileToOpen = selectedFileForRequirement;
    setSelectedFileForRequirement(null);
    setInitialFullscreenPref(preferFullscreen);
    setActiveViewingFile(fileToOpen);
  };

  const handleCloseViewer = () => {
    setActiveViewingFile(null);
    loadPublicData(); // Refresh views count
  };

  const handleLogout = () => {
    api.logout();
    setAdminUser(null);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500/30 selection:text-slate-900">
      
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        adminUser={adminUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigateBrowse={(folderId) => handleNavigate('browse', folderId)}
            onOpenSearch={() => setShowSearchModal(true)}
            onOpenFile={handleInitiateOpenFile}
            stats={publicStats}
            items={publicItems}
          />
        )}

        {currentView === 'browse' && (
          <BrowseView
            currentFolderId={currentFolderId}
            items={publicItems}
            onOpenFolder={handleOpenFolder}
            onNavigateBreadcrumb={(fId) => setCurrentFolderId(fId)}
            onOpenFile={handleInitiateOpenFile}
            isAdmin={!!adminUser}
          />
        )}

        {currentView === 'admin' && adminUser && (
          <AdminDashboard
            onOpenFile={handleInitiateOpenFile}
            onRefreshPublicData={loadPublicData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Requirement Screen ("Better Learning Experience" modal) */}
      {selectedFileForRequirement && (
        <ViewingRequirementModal
          file={selectedFileForRequirement}
          onProceed={handleProceedToViewer}
          onClose={() => setSelectedFileForRequirement(null)}
        />
      )}

      {/* Immersive Study Viewer (PDF & HTML) */}
      {activeViewingFile && (
        <StudyViewer
          file={activeViewingFile}
          onClose={handleCloseViewer}
          initialFullscreen={initialFullscreenPref}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        items={publicItems}
        onSelectItem={(item) => {
          if (item.type === 'folder') {
            handleOpenFolder(item.id);
          } else {
            handleInitiateOpenFile(item);
          }
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(user) => {
          setAdminUser(user);
          setCurrentView('admin');
        }}
      />

    </div>
  );
}
