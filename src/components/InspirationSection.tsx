import React from "react";
import { INSPIRATION_PROMPTS } from "../data/presets";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { InspirationPrompt } from "../types";

interface InspirationSectionProps {
  onSelectPrompt: (p: InspirationPrompt) => void;
  lang: "ar" | "en";
}

export const InspirationSection: React.FC<InspirationSectionProps> = ({
  onSelectPrompt,
  lang,
}) => {
  const isAr = lang === "ar";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? "أمثلة وإلهام فوتوغرافي جاهز:" : "Pro Inspirations & Prompts:"}</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {isAr ? "انقر لتجربة الإعداد فوراً" : "Click to apply"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {INSPIRATION_PROMPTS.slice(0, 3).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPrompt(item)}
            className="group p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-amber-500/50 text-start transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-800 text-amber-300 font-mono">
                  {item.categoryAr}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.aspectRatio}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition line-clamp-1">
                {isAr ? item.titleAr : item.titleEn}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {item.prompt}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-amber-400 transition">
              <span>{isAr ? "تطبيق البرومبت والإعدادات" : "Load Prompt & Settings"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
