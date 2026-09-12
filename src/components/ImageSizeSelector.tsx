import React from "react";
import { ImageSize } from "../types";
import { Sparkles, Zap, Award } from "lucide-react";

interface ImageSizeSelectorProps {
  value: ImageSize;
  onChange: (size: ImageSize) => void;
  lang: "ar" | "en";
}

export const ImageSizeSelector: React.FC<ImageSizeSelectorProps> = ({
  value,
  onChange,
  lang,
}) => {
  const isAr = lang === "ar";

  const sizes: {
    id: ImageSize;
    label: string;
    badge: string;
    descAr: string;
    descEn: string;
    icon: React.ReactNode;
    tag?: string;
  }[] = [
    {
      id: "1K",
      label: "1K (1024px)",
      badge: "Standard HD",
      descAr: "توليد سريع وعالي الجودة، ممتاز للشاشات والمشاركة.",
      descEn: "Fast generation, balanced clarity for social & web.",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: "2K",
      label: "2K (2048px)",
      badge: "Quad HD",
      descAr: "دقة مضاعفة فائقة النقاء، ممتازة للتصميم والمونتاج.",
      descEn: "Double resolution, razor-sharp details for design.",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      tag: isAr ? "موصى به" : "Recommended",
    },
    {
      id: "4K",
      label: "4K (4096px)",
      badge: "Ultra Masterpiece",
      descAr: "أعلى دقة فوتوغرافية، تفاصيل مجهرية مثالية للطباعة الضخمة.",
      descEn: "Maximum photographic fidelity, micro-textures for print.",
      icon: <Award className="w-3.5 h-3.5" />,
      tag: isAr ? "أعلى جودة" : "Pro Max",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>{isAr ? "دقة الصورة (Image Resolution)" : "Image Resolution"}</span>
        </label>
        <span className="text-[11px] font-mono text-amber-400/90 font-medium">
          gemini-3-pro-image-preview
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sizes.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`relative flex flex-col p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                active
                  ? "bg-amber-500/15 border-amber-500/80 text-amber-100 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {s.tag && (
                <span
                  className={`absolute -top-2 ${
                    isAr ? "left-2" : "right-2"
                  } text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                    active
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {s.tag}
                </span>
              )}

              <div className="flex items-center gap-1.5">
                <span className={active ? "text-amber-400" : "text-slate-500"}>
                  {s.icon}
                </span>
                <span className="text-xs font-bold font-mono tracking-tight text-white">
                  {s.id}
                </span>
              </div>

              <span
                className={`text-[10px] font-semibold mt-1 ${
                  active ? "text-amber-300" : "text-slate-500"
                }`}
              >
                {s.badge}
              </span>

              <p className="text-[10px] line-clamp-1 text-slate-400 mt-1 leading-tight hidden sm:block">
                {isAr ? s.descAr : s.descEn}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
