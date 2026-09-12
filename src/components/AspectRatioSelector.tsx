import React from "react";
import { AspectRatio } from "../types";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  lang: "ar" | "en";
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  value,
  onChange,
  lang,
}) => {
  const isAr = lang === "ar";

  const ratios: {
    id: AspectRatio;
    label: string;
    labelAr: string;
    sub: string;
    previewClass: string;
  }[] = [
    {
      id: "1:1",
      label: "Square",
      labelAr: "مربع",
      sub: "Instagram",
      previewClass: "w-4 h-4",
    },
    {
      id: "3:4",
      label: "Portrait",
      labelAr: "بورتريه",
      sub: "Studio Headshot",
      previewClass: "w-3.5 h-4.5",
    },
    {
      id: "4:3",
      label: "Photo",
      labelAr: "فوتوغرافي",
      sub: "Classic Camera",
      previewClass: "w-4.5 h-3.5",
    },
    {
      id: "16:9",
      label: "Landscape",
      labelAr: "عريض",
      sub: "Cinematic / PC",
      previewClass: "w-5 h-3",
    },
    {
      id: "9:16",
      label: "Story",
      labelAr: "طولي",
      sub: "TikTok / Reels",
      previewClass: "w-3 h-5",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>{isAr ? "أبعاد الصورة (Aspect Ratio)" : "Aspect Ratio"}</span>
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          {value}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {ratios.map((r) => {
          const active = value === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onChange(r.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                active
                  ? "bg-cyan-500/15 border-cyan-500/80 text-cyan-200 ring-1 ring-cyan-500/30"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div
                className={`border rounded-xs mb-1.5 flex items-center justify-center ${
                  r.previewClass
                } ${
                  active
                    ? "border-cyan-400 bg-cyan-400/20"
                    : "border-slate-600 bg-slate-800"
                }`}
              />
              <span className="text-[11px] font-mono font-bold text-white leading-none">
                {r.id}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 leading-none truncate max-w-full">
                {isAr ? r.labelAr : r.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
