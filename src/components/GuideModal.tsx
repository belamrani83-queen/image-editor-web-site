import React from "react";
import { X, Camera, Sparkles, Sliders, Zap } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isAr ? "دليل احتراف التصوير بالذكاء الاصطناعي" : "Pro Photography AI Guide"}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? "أسرار الحصول على صور واقعية لا تشوبها شائبة" : "How to generate award-winning photorealistic images"}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? "1. الدقة وحجم الصورة (1K • 2K • 4K)" : "1. Image Resolutions"}</span>
            </h4>
            <p className="text-slate-400">
              {isAr
                ? "يسمح نموذج gemini-3-pro-image-preview بتحديد دقة 1K للمعاينة السريعة، أو 2K للتفاصيل المتقنة، أو 4K (4096 بكسل) للحصول على أدق تفاصيل مسام الجلد، الانعكاسات، والأقمشة بجودة تجارية."
                : "gemini-3-pro-image-preview supports 1K for rapid previews, 2K for high precision, and 4K (4096px) for commercial-grade microscopic textures, fabric weave, and reflections."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? "2. زر «تطوير البرومبت بالسحر» (Enhance Prompt)" : "2. AI Prompt Enhancer"}</span>
            </h4>
            <p className="text-slate-400">
              {isAr
                ? "إذا كتبت فكرة بسيطة بالدارجة أو العربية مثل «صورة لرجل أعمال مغربي أنيق في مقهى»، اضغط على زر «تطوير البرومبت» ليقوم الذكاء الاصطناعي بإضافة مواصفات الكاميرا والعدسة والإضاءة تلقائياً."
                : "If you type a simple concept, click 'Enhance Prompt' to automatically inject camera model, depth of field, color grading, and lighting parameters."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-bold text-violet-300 mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isAr ? "3. اختيار العدسة والإضاءة" : "3. Lighting & Optics"}</span>
            </h4>
            <p className="text-slate-400">
              {isAr
                ? "• عدسة 85 مم: الأفضل للبورتريه لعزل الخلفية بنعومة.\n• عدسة 100 مم ماكرو: لإظهار تفاصيل المنتجات والمجوهرات.\n• إضاءة سوفت بوكس: تعطي مظهر جلسات التصوير الاحترافية النظيفة."
                : "• 85mm f/1.4: Ideal for portraits with creamy bokeh.\n• 100mm Macro: Perfect for jewelry and product textures.\n• Softbox: Clean studio lighting for commercial clarity."}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs"
          >
            {isAr ? "فهمت، لنبدأ الإبداع" : "Got it, let's create"}
          </button>
        </div>
      </div>
    </div>
  );
};
