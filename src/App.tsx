import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageSizeSelector } from "./components/ImageSizeSelector";
import { AspectRatioSelector } from "./components/AspectRatioSelector";
import { ReferenceUploader } from "./components/ReferenceUploader";
import { StyleAccordion } from "./components/StyleAccordion";
import { InspirationSection } from "./components/InspirationSection";
import { ImageCanvas } from "./components/ImageCanvas";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { GuideModal } from "./components/GuideModal";
import {
  ImageSize,
  AspectRatio,
  GeneratedPhoto,
  InspirationPrompt,
} from "./types";
import { STYLE_PRESETS, LIGHTING_PRESETS, LENS_PRESETS } from "./data/presets";
import {
  Camera,
  Sparkles,
  AlertCircle,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const isAr = lang === "ar";

  // Configuration & Creative Parameters
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [selectedStyle, setSelectedStyle] = useState<string | null>("studio-portrait");
  const [selectedLighting, setSelectedLighting] = useState<string | null>("softbox");
  const [selectedLens, setSelectedLens] = useState<string | null>("85mm");
  const [referenceImage, setReferenceImage] = useState<{
    data: string;
    mimeType: string;
    name: string;
  } | null>(null);

  // App Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<GeneratedPhoto | null>(null);
  const [history, setHistory] = useState<GeneratedPhoto[]>([]);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("studio_pro_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentPhoto(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Sync history to localStorage
  const saveToHistory = (newPhoto: GeneratedPhoto) => {
    setHistory((prev) => {
      const updated = [newPhoto, ...prev.filter((p) => p.id !== newPhoto.id)].slice(0, 30);
      try {
        localStorage.setItem("studio_pro_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage quota full, keeping in memory", e);
      }
      return updated;
    });
  };

  // Helper to construct pro photographic prompt
  const buildFullPrompt = (basePrompt: string) => {
    const parts: string[] = [basePrompt.trim()];

    if (selectedStyle) {
      const st = STYLE_PRESETS.find((s) => s.id === selectedStyle);
      if (st) parts.push(st.promptSnippet);
    }

    if (selectedLighting) {
      const lt = LIGHTING_PRESETS.find((l) => l.id === selectedLighting);
      if (lt) parts.push(lt.promptSnippet);
    }

    if (selectedLens) {
      const ln = LENS_PRESETS.find((l) => l.id === selectedLens);
      if (ln) parts.push(ln.promptSnippet);
    }

    // Default professional camera baseline
    parts.push("masterpiece 8k commercial photography, hyper-detailed, clean natural colors, sharp focus");

    return parts.join(", ");
  };

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setError(isAr ? "المرجو كتابة فكرة أو وصف أولاً لتطويرها!" : "Please write a prompt idea first!");
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle ? STYLE_PRESETS.find((s) => s.id === selectedStyle)?.name : undefined,
          lighting: selectedLighting ? LIGHTING_PRESETS.find((l) => l.id === selectedLighting)?.name : undefined,
          camera: selectedLens ? LENS_PRESETS.find((l) => l.id === selectedLens)?.name : undefined,
        }),
      });

      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err: any) {
      console.error("Enhance failed:", err);
      // Fallback: manually enrich with selected camera specs
      const enriched = buildFullPrompt(prompt);
      setPrompt(enriched);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Primary Image Generation using gemini-3-pro-image-preview
  const handleGenerateImage = async () => {
    if (!prompt.trim() && !referenceImage) {
      setError(isAr ? "يرجى إدخال وصف للصورة أو رفع صورة مرجعية." : "Please enter a prompt or reference image.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const finalPrompt = buildFullPrompt(prompt || "hyperrealistic professional photograph");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: "gemini-3-pro-image-preview",
          imageSize: imageSize, // "1K" | "2K" | "4K"
          aspectRatio: aspectRatio,
          referenceImage: referenceImage
            ? { data: referenceImage.data, mimeType: referenceImage.mimeType }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || data.details || "Failed to generate image.");
      }

      const newPhoto: GeneratedPhoto = {
        id: `photo-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: prompt || "Photo transformation",
        enhancedPrompt: finalPrompt,
        model: "gemini-3-pro-image-preview",
        imageSize: imageSize,
        aspectRatio: aspectRatio,
        timestamp: Date.now(),
        styleName: selectedStyle ? STYLE_PRESETS.find((s) => s.id === selectedStyle)?.nameAr : undefined,
        notes: data.notes,
        referenceImage: referenceImage?.data,
      };

      setCurrentPhoto(newPhoto);
      saveToHistory(newPhoto);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(
        err.message ||
          (isAr
            ? "تعذر توليد الصورة. تأكد من إعداد مفتاح API في Settings > Secrets."
            : "Could not generate image. Verify your Gemini API key in Settings > Secrets.")
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Load from Inspiration Card
  const handleSelectInspiration = (item: InspirationPrompt) => {
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
    setSelectedLighting(item.lighting);
    setSelectedLens(item.lens);
    setAspectRatio(item.aspectRatio);
    setError(null);
  };

  // Use previous photo as reference for iterative editing
  const handleUseAsReference = (photo: GeneratedPhoto) => {
    setReferenceImage({
      data: photo.imageUrl,
      mimeType: "image/png",
      name: `Reference (${photo.imageSize})`,
    });
    setAspectRatio(photo.aspectRatio);
    setImageSize(photo.imageSize);
    setError(null);
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${
        isAr ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Navigation Header */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenInfo={() => setIsGuideOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold mb-0.5">
                {isAr ? "تنبيه أثناء المعالجة" : "Attention"}
              </h4>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white text-xs underline font-medium"
            >
              {isAr ? "إغلاق" : "Dismiss"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Creative Studio Controls (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Prompt Input Box */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{isAr ? "وصف الصورة الفوتوغرافية (Prompt)" : "Photo Prompt Description"}</span>
                </label>

                {/* AI Prompt Enhancer Button */}
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  title={isAr ? "تحويل الفكرة البسيطة إلى وصف فوتوغرافي متكامل بالذكاء الاصطناعي" : "Enhance prompt with pro photographic parameters"}
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                  <span>{isAr ? "تطوير البرومبت بالذكاء الاصطناعي" : "Enhance Prompt"}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    isAr
                      ? "مثال: بورتريه لرجل أعمال مغربي أنيق في مقهى عتيق بالدار البيضاء، أو زجاجة عطر فاخرة فوق صخرة بركانية..."
                      : "e.g., A charismatic Moroccan craftsman in an ambient lantern workshop in Marrakech, or a luxury watch macro shot..."
                  }
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 placeholder:text-slate-500 resize-none transition outline-none"
                />
              </div>

              {/* Resolution / Image Size (1K, 2K, 4K) Selector - Core Mandate */}
              <ImageSizeSelector
                value={imageSize}
                onChange={setImageSize}
                lang={lang}
              />

              {/* Aspect Ratio Selector */}
              <AspectRatioSelector
                value={aspectRatio}
                onChange={setAspectRatio}
                lang={lang}
              />

              {/* Reference Photo / Image-to-Image */}
              <ReferenceUploader
                referenceImage={referenceImage}
                onSelectImage={setReferenceImage}
                lang={lang}
              />

              {/* Primary Shooting Trigger Button */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGenerating || (!prompt.trim() && !referenceImage)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950 stroke-[2.5]" />
                    <span>{isAr ? `جاري التقاط الصورة بدقة ${imageSize}...` : `Synthesizing ${imageSize} Photo...`}</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-slate-950 stroke-[2.5] group-hover:scale-110 transition-transform" />
                    <span>
                      {isAr ? `التقاط الصورة الاحترافية (${imageSize})` : `Capture Pro Photo (${imageSize})`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Pro Photography Settings: Style, Lighting, Lens */}
            <StyleAccordion
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              selectedLighting={selectedLighting}
              onSelectLighting={setSelectedLighting}
              selectedLens={selectedLens}
              onSelectLens={setSelectedLens}
              lang={lang}
            />

            {/* Inspiration presets */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
              <InspirationSection
                onSelectPrompt={handleSelectInspiration}
                lang={lang}
              />
            </div>
          </div>

          {/* Right Column: High-Res Visual Canvas (7 cols on lg) */}
          <div className="lg:col-span-7 h-full">
            <ImageCanvas
              currentPhoto={currentPhoto}
              isGenerating={isGenerating}
              onRegenerate={handleGenerateImage}
              onUseAsReference={handleUseAsReference}
              lang={lang}
            />

            {/* Studio Technical Specs Bar */}
            <div className="mt-4 p-3 rounded-xl border border-slate-800/80 bg-slate-900/30 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-300">
                  {isAr ? "محرك التوليد النشط:" : "Active Engine:"}
                </span>
                <span className="font-mono text-amber-300">gemini-3-pro-image-preview</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-slate-400">
                  {isAr ? "الدقة المحددة:" : "Target Size:"}{" "}
                  <strong className="text-cyan-300">{imageSize}</strong>
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  {isAr ? "الأبعاد:" : "Ratio:"}{" "}
                  <strong className="text-slate-200">{aspectRatio}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectPhoto={(photo) => setCurrentPhoto(photo)}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem("studio_pro_history");
        }}
        lang={lang}
      />

      {/* Pro Tips & Photography Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
