import React from "react";
import { GeneratedPhoto } from "../types";
import { X, Trash2, Download, ExternalLink, Camera } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedPhoto[];
  onSelectPhoto: (photo: GeneratedPhoto) => void;
  onClearHistory: () => void;
  lang: "ar" | "en";
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPhoto,
  onClearHistory,
  lang,
}) => {
  const isAr = lang === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {isAr ? "معرض الصور السابقة" : "Generation History"}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1"
                title={isAr ? "مسح السجل" : "Clear All"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? "مسح الكل" : "Clear"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Camera className="w-12 h-12 mb-3 stroke-1 opacity-50" />
              <p className="text-sm font-medium">
                {isAr ? "لا توجد صور سابقة بعد" : "No photos generated yet"}
              </p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                {isAr
                  ? "كل صورة تلتقطها وتولدها ستُحفظ هنا تلقائياً لتتمكن من الرجوع إليها وتحميلها في أي وقت."
                  : "Every generated photo will automatically appear here for easy review and download."}
              </p>
            </div>
          ) : (
            history.map((photo) => (
              <div
                key={photo.id}
                className="group p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/50 transition flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  onSelectPhoto(photo);
                  onClose();
                }}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.prompt}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-800 shrink-0 group-hover:scale-105 transition"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {photo.imageSize}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {photo.aspectRatio}
                    </span>
                    <span className="text-[9px] text-slate-500 ml-auto">
                      {new Date(photo.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-tight">
                    {photo.prompt}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
