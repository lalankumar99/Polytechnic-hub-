import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  Code,
  X,
  Sun,
  Moon,
  Coffee,
  Share2,
  Check,
  Smartphone,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { StudyItem } from '../types';
import { requestFullscreenAndLandscape, exitFullscreen, formatFileSize } from '../utils/formatters';

interface StudyViewerProps {
  file: StudyItem;
  onClose: () => void;
  initialFullscreen?: boolean;
}

export const StudyViewer: React.FC<StudyViewerProps> = ({
  file,
  onClose,
  initialFullscreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<number>(16);
  const [copied, setCopied] = useState(false);
  const [orientationMsg, setOrientationMsg] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);

  const isPdf = file.type === 'pdf';
  const fileApiUrl = file.fileUrl || `/api/files/${file.id}`;

  // Enter fullscreen on mount if requested
  useEffect(() => {
    if (initialFullscreen && containerRef.current) {
      requestFullscreenAndLandscape(containerRef.current).then(({ fullscreenGranted, orientationGranted }) => {
        setIsFullscreen(fullscreenGranted || initialFullscreen);
        if (!orientationGranted && window.innerWidth < 768) {
          setOrientationMsg('Please rotate your device horizontally for landscape study view');
          setTimeout(() => setOrientationMsg(null), 4000);
        }
      });
    }

    const handleFullscreenChange = () => {
      const isDocFs = !!document.fullscreenElement;
      setIsFullscreen(isDocFs);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initialFullscreen, isFullscreen]);

  const toggleFullscreen = async () => {
    if (!isFullscreen && containerRef.current) {
      const { fullscreenGranted } = await requestFullscreenAndLandscape(containerRef.current);
      setIsFullscreen(fullscreenGranted || true);
    } else {
      exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 60));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe HTML content wrapper for rendering
  const formattedHtml = file.content || `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: auto; }
          h1 { color: #0284c7; }
        </style>
      </head>
      <body>
        <h1>${file.name}</h1>
        <p>${file.description || 'Study notes uploaded on POLYTECHNIC HUB.'}</p>
      </body>
    </html>
  `;

  // -------------------------------------------------------------
  // FULL-SCREEN IMMERSIVE HTML VIEWER (Zero UI, 100vw, 100vh)
  // -------------------------------------------------------------
  if (!isPdf && isFullscreen) {
    return (
      <div
        ref={containerRef}
        id="polytechnic-immersive-html-viewer"
        className="fixed inset-0 z-50 w-screen h-screen m-0 p-0 overflow-hidden bg-white select-text"
      >
        {/* Floating Minimal Exit Control */}
        <div className="fixed top-3 right-3 z-50 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 text-white shadow-xl hover:bg-slate-900 transition-all opacity-80 hover:opacity-100">
          <span className="text-[11px] font-bold text-slate-300 hidden sm:inline">{file.name}</span>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-1 rounded-full hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
            title="Exit Full-Screen (Esc)"
          >
            <Minimize className="w-4 h-4" />
            <span className="text-[11px] font-bold">Exit Fullscreen</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
            title="Close Viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 100vw / 100vh Edge-to-Edge Embedded HTML Frame */}
        <iframe
          srcDoc={formattedHtml}
          title={file.name}
          className="w-full h-full border-0 m-0 p-0 block bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // STANDARD STUDY VIEWER (PDF and Standard HTML Layout)
  // -------------------------------------------------------------
  return (
    <div
      ref={containerRef}
      id="polytechnic-study-viewer"
      className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden select-none font-sans"
    >
      {/* TOP HEADER BAR */}
      <header className="h-14 sm:h-16 bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-md">
        
        {/* Left: Back + Doc Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            id="viewer-back-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer"
            title="Back to library"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Back</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                isPdf ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {file.type.toUpperCase()}
              </span>
              <h1 className="font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md lg:max-w-lg">
                {file.name}
              </h1>
            </div>
            {(file.subject || file.branch) && (
              <span className="text-[11px] text-slate-400 truncate block">
                {[file.branch, file.semester, file.subject, file.unit].filter(Boolean).join(' • ')}
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* HTML Theme Selector (Standard mode) */}
          {!isPdf && (
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-md ${theme === 'sepia' ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-white'}`}
                title="Sepia Theme"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Direct File Link / Open in Tab */}
          <a
            href={fileApiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Download Direct */}
          <a
            href={fileApiUrl}
            download={file.name}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download Study Material"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Mode Toggle */}
          <button
            id="viewer-fullscreen-btn"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (100vw/100vh)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* ORIENTATION HINT TOAST */}
      {orientationMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-cyan-950/95 border border-cyan-500 text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2 z-50 animate-bounce">
          <Smartphone className="w-4 h-4 rotate-90" />
          <span>{orientationMsg}</span>
        </div>
      )}

      {/* MAIN READING CANVAS */}
      <main className="flex-1 overflow-auto bg-slate-950 p-2 sm:p-4 flex items-center justify-center">
        
        {/* PDF VIEWING MODE (Dynamic native PDF embed) */}
        {isPdf ? (
          <div
            className="w-full h-full max-w-5xl flex flex-col items-center justify-center transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <iframe
              src={`${fileApiUrl}#view=FitH`}
              title={file.name}
              onError={() => setPdfLoadError(true)}
              className="w-full h-full rounded-xl bg-white shadow-2xl border border-slate-800"
            />
            {pdfLoadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-xl space-y-4">
                <FileText className="w-12 h-12 text-rose-400" />
                <h3 className="text-lg font-bold">PDF Reader Preview</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">
                  Your browser preferences prevented inline PDF rendering. You can open or download the document directly:
                </p>
                <a
                  href={fileApiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open PDF in New Window</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD HTML MODE */
          <div
            className={`w-full max-w-4xl h-full rounded-2xl shadow-2xl p-6 sm:p-10 transition-colors border overflow-y-auto ${
              theme === 'light'
                ? 'bg-white text-slate-900 border-slate-200'
                : theme === 'sepia'
                ? 'bg-[#fcf6e8] text-[#433422] border-[#e8dcc4]'
                : 'bg-slate-900 text-slate-100 border-slate-800'
            }`}
            style={{
              fontSize: `${fontSize}px`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {file.content ? (
              <div
                className="study-html-content space-y-4"
                dangerouslySetInnerHTML={{ __html: file.content }}
              />
            ) : (
              <iframe
                srcDoc={formattedHtml}
                title={file.name}
                className="w-full h-full border-0 bg-transparent min-h-[500px]"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            )}
          </div>
        )}

      </main>

      {/* BOTTOM TOOLBAR */}
      <footer className="h-14 sm:h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-lg">
        
        {/* Left: Font Size or Info */}
        <div className="flex items-center space-x-2">
          {!isPdf ? (
            <div className="flex items-center space-x-1.5 bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setFontSize(s => Math.max(s - 2, 12))}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white font-bold cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-slate-400 font-mono">{fontSize}px</span>
              <button
                onClick={() => setFontSize(s => Math.min(s + 2, 26))}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white font-bold cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              {formatFileSize(file.size)}
            </span>
          )}
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-800 rounded-xl p-1 border border-slate-700">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-200 px-2 min-w-[50px] text-center">
            {zoomLevel}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Rotate & Landscape Fullscreen Mode */}
        <div className="flex items-center space-x-2">
          {isPdf && (
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Full-Screen View'}</span>
          </button>
        </div>

      </footer>
    </div>
  );
};

