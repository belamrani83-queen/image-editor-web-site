export type ImageSize = "1K" | "2K" | "4K";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";

export interface PhotographyPreset {
  id: string;
  name: string;
  nameAr: string;
  category: "style" | "lighting" | "lens" | "color";
  promptSnippet: string;
  descriptionAr: string;
  icon?: string;
}

export interface GeneratedPhoto {
  id: string;
  imageUrl: string;
  prompt: string;
  enhancedPrompt?: string;
  model: string;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  timestamp: number;
  styleName?: string;
  notes?: string;
  referenceImage?: string;
}

export interface InspirationPrompt {
  id: string;
  titleAr: string;
  titleEn: string;
  prompt: string;
  style: string;
  lighting: string;
  lens: string;
  aspectRatio: AspectRatio;
  categoryAr: string;
}
