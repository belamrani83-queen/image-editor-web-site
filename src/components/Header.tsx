import React from "react";
import { Camera, Sparkles, Sliders, History, Info } from "lucide-react";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onOpenHistory,
  historyCount,
  onOpenInfo,
}) => {
  const isAr = lang === "ar";

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Model indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
            <Camera className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Studio Pro</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-medium">
                  AI Photo
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isAr ? "استوديو توليد الصور الفوتوغرافية الفاخرة" : "High-Resolution AI Photography Studio"}
            </p>
          </div>
        </div>

        {/* Model & Resolution Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Model:</span>
          <span className="text-amber-300 font-semibold">gemini-3-pro-image-preview</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Engine:</span>
          <span className="text-cyan-300">1K • 2K • 4K</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
            title={isAr ? "معرض الصور السابقة" : "History & Gallery"}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{isAr ? "المعرض" : "Gallery"}</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Guide / Info modal */}
          <button
            onClick={onOpenInfo}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
            title={isAr ? "دليل التصوير الاحترافي" : "Pro Tips & Guide"}
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isAr ? "دليل التصوير" : "Guide"}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
          >
            {isAr ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </header>
  );
};
