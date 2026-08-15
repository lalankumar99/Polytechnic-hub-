import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  RotateCw,
  FileText,
  Code,
  X,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { StudyItem } from '../types';
import { formatFileSize } from '../utils/formatters';

interface ViewingRequirementModalProps {
  file: StudyItem;
  onProceed: (preferFullscreen: boolean) => void;
  onClose: () => void;
}

export const ViewingRequirementModal: React.FC<ViewingRequirementModalProps> = ({
  file,
  onProceed,
  onClose
}) => {
  const isPdf = file.type === 'pdf';
  const [rotated, setRotated] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 sm:p-7 text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Study Mode Optimizer</span>
        </div>

        {/* Document Info preview */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isPdf ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isPdf ? <FileText className="w-5 h-5" /> : <Code className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-white truncate">{file.name}</h4>
            <span className="text-[11px] text-slate-400">
              {isPdf ? 'PDF Document' : 'Interactive HTML Guide'} • {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        {/* Requirement Graphic & Title */}
        <div className="text-center space-y-4 py-2">
          {/* Animated phone rotate graphic */}
          <div className="relative w-28 h-20 mx-auto flex items-center justify-center">
            <div className="w-16 h-24 rounded-xl border-2 border-dashed border-cyan-400/40 absolute flex items-center justify-center text-[10px] text-slate-500">
              Portrait
            </div>
            <div
              className={`w-24 h-16 rounded-xl border-2 border-cyan-400 bg-cyan-950/40 text-cyan-300 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 z-10 transition-transform duration-700 ${
                rotated ? 'scale-105 ring-2 ring-cyan-400' : 'animate-pulse'
              }`}
            >
              <Smartphone className="w-6 h-6 rotate-90 text-cyan-400" />
              <span className="text-[10px] font-bold mt-0.5">Landscape</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Better Learning Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
              Please rotate your device to <strong className="text-cyan-400">landscape mode</strong> and enter <strong className="text-cyan-400">full-screen view</strong> for the best reading experience.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-[11px] text-slate-400 text-left flex items-start space-x-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              If automatic rotation is not supported on your browser or device, simply rotate your phone manually or maximize window width.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            id="modal-open-fullscreen-landscape-btn"
            onClick={() => onProceed(true)}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-cyan-200" />
            <span>Open Full Screen & Landscape</span>
          </button>

          <button
            id="modal-continue-standard-btn"
            onClick={() => onProceed(false)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Continue in Standard View
          </button>
        </div>

      </div>
    </div>
  );
};
