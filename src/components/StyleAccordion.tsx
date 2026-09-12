import React, { useState } from "react";
import { STYLE_PRESETS, LIGHTING_PRESETS, LENS_PRESETS } from "../data/presets";
import { Sliders, ChevronDown, Check } from "lucide-react";

interface StyleAccordionProps {
  selectedStyle: string | null;
  onSelectStyle: (id: string | null) => void;
  selectedLighting: string | null;
  onSelectLighting: (id: string | null) => void;
  selectedLens: string | null;
  onSelectLens: (id: string | null) => void;
  lang: "ar" | "en";
}

export const StyleAccordion: React.FC<StyleAccordionProps> = ({
  selectedStyle,
  onSelectStyle,
  selectedLighting,
  onSelectLighting,
  selectedLens,
  onSelectLens,
  lang,
}) => {
  const isAr = lang === "ar";
  const [isOpen, setIsOpen] = useState(true);

  const activeCount =
    (selectedStyle ? 1 : 0) + (selectedLighting ? 1 : 0) + (selectedLens ? 1 : 0);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-start hover:bg-slate-800/40 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">
            {isAr ? "إعدادات التصوير المتقدمة (Camera & Lighting)" : "Pro Photography Controls"}
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              {activeCount} {isAr ? "مفعل" : "active"}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 space-y-4 border-t border-slate-800/60">
          {/* 1. Photography Style */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                {isAr ? "أسلوب التصوير الفوتوغرافي:" : "Photography Style:"}
              </span>
              {selectedStyle && (
                <button
                  type="button"
                  onClick={() => onSelectStyle(null)}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  {isAr ? "إلغاء التحديد" : "Clear"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STYLE_PRESETS.map((st) => {
                const active = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onSelectStyle(active ? null : st.id)}
                    className={`p-2 rounded-lg border text-start transition cursor-pointer flex flex-col justify-between ${
                      active
                        ? "bg-amber-500/20 border-amber-500 text-amber-100 ring-1 ring-amber-500/40"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {isAr ? st.nameAr : st.name}
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-1">
                      {isAr ? st.descriptionAr : st.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Studio Lighting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                {isAr ? "توزيع الإضاءة الاستوديو:" : "Studio Lighting:"}
              </span>
              {selectedLighting && (
                <button
                  type="button"
                  onClick={() => onSelectLighting(null)}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  {isAr ? "إلغاء التحديد" : "Clear"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LIGHTING_PRESETS.map((lt) => {
                const active = selectedLighting === lt.id;
                return (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() => onSelectLighting(active ? null : lt.id)}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 font-medium"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <span>{isAr ? lt.nameAr : lt.name}</span>
                    {active && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Camera Lens & Optics */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                {isAr ? "نوع العدسة والعمق البصري:" : "Camera Lens & Optics:"}
              </span>
              {selectedLens && (
                <button
                  type="button"
                  onClick={() => onSelectLens(null)}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  {isAr ? "إلغاء التحديد" : "Clear"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {LENS_PRESETS.map((lens) => {
                const active = selectedLens === lens.id;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => onSelectLens(active ? null : lens.id)}
                    className={`p-2 rounded-lg border text-start transition cursor-pointer flex flex-col justify-between ${
                      active
                        ? "bg-amber-500/20 border-amber-500 text-amber-100 ring-1 ring-amber-500/40"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {isAr ? lens.nameAr : lens.name}
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-1">
                      {isAr ? lens.descriptionAr : lens.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
