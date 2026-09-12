import React, { useState } from "react";
import { GeneratedPhoto } from "../types";
import {
  Download,
  Maximize2,
  Copy,
  Check,
  Sparkles,
  Camera,
  RefreshCw,
  Share2,
  X,
  Layers,
} from "lucide-react";

interface ImageCanvasProps {
  currentPhoto: GeneratedPhoto | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onUseAsReference: (photo: GeneratedPhoto) => void;
  lang: "ar" | "en";
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  currentPhoto,
  isGenerating,
  onRegenerate,
  onUseAsReference,
  lang,
}) => {
  const isAr = lang === "ar";
  const [isCopied, setIsCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleCopyPrompt = () => {
    if (!currentPhoto) return;
    navigator.clipboard.writeText(currentPhoto.enhancedPrompt || currentPhoto.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentPhoto) return;
    const link = document.createElement("a");
    link.href = currentPhoto.imageUrl;
    link.download = `StudioPro-${currentPhoto.imageSize}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-2xl">
      {/* Canvas Top Bar */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <span className="text-xs font-bold tracking-tight text-white">
            {isAr ? "شاشة العرض الفوتوغرافي" : "Photographic Canvas"}
          </span>
          {currentPhoto && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentPhoto.imageSize} ({currentPhoto.aspectRatio})
            </span>
          )}
        </div>

        {currentPhoto && !isGenerating && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyPrompt}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
              title={isAr ? "نسخ البرومبت" : "Copy Prompt"}
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs"
              title={isAr ? "تكبير الشاشة الكاملة" : "Fullscreen Preview"}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownload}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
              title={isAr ? "تحميل الصورة بالدقة الكاملة" : "Download High-Res Photo"}
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{isAr ? "تحميل" : "Download"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 min-h-[420px] bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
        {/* Subtle studio grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

        {isGenerating ? (
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-md">
            {/* Shutter Animation */}
            <div className="relative w-24 h-24 mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-amber-500/40 animate-pulse" />
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-400 animate-spin flex items-center justify-center">
                <Camera className="w-8 h-8 text-amber-400 animate-bounce" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">
              {isAr
                ? "جاري التقاط ومعالجة الصورة فائقة الدقة..."
                : "Capturing & Synthesizing High-Res Photo..."}
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              {isAr
                ? "يتم الآن تطبيق النموذج gemini-3-pro-image-preview مع محاكاة إعدادات العدسات والإضاءة الاحترافية."
                : "Rendering with gemini-3-pro-image-preview with physical camera optics and lighting."}
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>{isAr ? "معالجة الدقة العالية..." : "Rendering High-Fidelity Pixels..."}</span>
            </div>
          </div>
        ) : currentPhoto ? (
          <div className="relative z-10 flex flex-col items-center justify-center max-h-full max-w-full group">
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.prompt}
              referrerPolicy="no-referrer"
              className="max-h-[520px] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800 transition duration-300"
            />

            {/* Quick Action Overlay on Hover */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-xl flex items-center gap-2">
              <button
                onClick={() => onUseAsReference(currentPhoto)}
                className="text-xs text-slate-200 hover:text-amber-400 flex items-center gap-1 font-medium transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? "تعديل هذه الصورة" : "Use as Reference"}</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={onRegenerate}
                className="text-xs text-slate-200 hover:text-amber-400 flex items-center gap-1 font-medium transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isAr ? "إعادة التوليد" : "Regenerate"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-500 shadow-inner">
              <Camera className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              {isAr ? "استوديو الصور الاحترافية جاهز" : "Studio Ready for Shooting"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {isAr
                ? "اكتب فكرتك بالدارجة أو العربية أو الإنجليزية، حدد الدقة (1K، 2K، 4K)، واضغط على «التقاط الصورة» لتوليد تحفة فوتوغرافية."
                : "Type your idea, select your resolution (1K, 2K, 4K), and hit 'Generate Photo' to create high-resolution photographic art."}
            </p>
          </div>
        )}
      </div>

      {/* Canvas Bottom Information Footer */}
      {currentPhoto && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 truncate max-w-xl">
            <span className="text-slate-500 shrink-0 font-semibold">
              {isAr ? "البرومبت:" : "Prompt:"}
            </span>
            <span className="truncate text-slate-300 font-mono text-[11px]">
              {currentPhoto.prompt}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onUseAsReference(currentPhoto)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>{isAr ? "صنع تعديل / نسخة أخرى" : "Variation"}</span>
            </button>
            <button
              onClick={onRegenerate}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? "إعادة" : "Retry"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.prompt}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-slate-800"
          />

          <div className="absolute bottom-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-center max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-1 text-xs font-mono text-amber-400">
              <span>{currentPhoto.model}</span>
              <span>•</span>
              <span>{currentPhoto.imageSize}</span>
              <span>•</span>
              <span>{currentPhoto.aspectRatio}</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2">
              {currentPhoto.enhancedPrompt || currentPhoto.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
