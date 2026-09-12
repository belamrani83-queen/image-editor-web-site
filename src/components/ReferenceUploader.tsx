import React, { useRef } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

interface ReferenceUploaderProps {
  referenceImage: { data: string; mimeType: string; name: string } | null;
  onSelectImage: (img: { data: string; mimeType: string; name: string } | null) => void;
  lang: "ar" | "en";
}

export const ReferenceUploader: React.FC<ReferenceUploaderProps> = ({
  referenceImage,
  onSelectImage,
  lang,
}) => {
  const isAr = lang === "ar";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onSelectImage({
        data: dataUrl,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
          <span>{isAr ? "صورة مرجعية / تعديل صورة (اختياري)" : "Reference / Edit Photo (Optional)"}</span>
        </label>
        {referenceImage && (
          <button
            type="button"
            onClick={() => onSelectImage(null)}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
          >
            <X className="w-3 h-3" />
            <span>{isAr ? "حذف" : "Remove"}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {referenceImage ? (
        <div className="relative rounded-xl border border-violet-500/50 bg-violet-950/20 p-2 flex items-center gap-3">
          <img
            src={referenceImage.data}
            alt="Reference preview"
            referrerPolicy="no-referrer"
            className="w-14 h-14 object-cover rounded-lg border border-violet-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-violet-200 truncate">
              {referenceImage.name}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isAr
                ? "سيتم استخدامها كمرجع وتوجيه بواسطة النموذج"
                : "Will guide generation / restyling with Gemini Pro"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectImage(null)}
            className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-700/80 hover:border-violet-500/60 rounded-xl p-3 text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-900/80 group"
        >
          <div className="flex items-center justify-center gap-2 text-slate-400 group-hover:text-violet-300">
            <UploadCloud className="w-4 h-4" />
            <span className="text-xs font-medium">
              {isAr
                ? "اسحب صورة هنا أو انقر للرفع (تعديل أو محاكاة أسلوب)"
                : "Drag a photo or click to upload (Image-to-Image)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
