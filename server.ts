import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit to support high-resolution base64 reference photos
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables. Please check Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    defaultModel: "gemini-3-pro-image-preview",
  });
});

// Prompt Enhancer (Expands ideas into professional photography prompts)
app.post("/api/enhance-prompt", async (req, res) => {
  try {
    const { prompt, style, lighting, camera } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();

    const systemInstruction = `You are an elite master photographer and creative director specializing in hyper-realistic, commercial, and editorial photography prompts for generative AI models (like Gemini Pro Image).
Your task is to transform the user's input idea (which might be in Arabic, Moroccan Darija, French, or English) into an exquisite, highly detailed photography prompt in English.

Include:
- Clear primary subject and action
- Photographic lens and camera equipment (e.g. Hasselblad H6D-100c, Sony A7R V, 85mm f/1.2 lens, Leica M11)
- Specific lighting setup (e.g. dramatic Rembrandt lighting, soft golden hour rim light, diffused profoto softbox, volumetric god rays)
- Textures, materials, and fine details (e.g. natural skin micro-textures, intricate fabric weaves, crisp reflections)
- Composition and perspective (e.g. cinematic shallow depth of field, rule of thirds, medium close-up)
- Color grading (e.g. Kodak Portra 400 tones, high dynamic range, muted cinematic palette)

User preferences to incorporate:
- Style: ${style || "Photorealistic Studio"}
- Lighting: ${lighting || "Professional Studio Lighting"}
- Camera/Framing: ${camera || "Medium Portrait, 85mm lens"}

Return ONLY the enhanced prompt string with no markdown formatting, quotes, or conversational filler.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Input Idea: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const enhanced = response.text?.trim() || prompt;
    return res.json({ enhancedPrompt: enhanced });
  } catch (error: any) {
    console.error("Enhance prompt error:", error);
    return res.status(500).json({
      error: error.message || "Failed to enhance prompt",
      fallback: req.body?.prompt,
    });
  }
});

// Primary Image Generation Endpoint
app.post("/api/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      model = "gemini-3-pro-image-preview",
      imageSize = "1K",
      aspectRatio = "1:1",
      referenceImage, // optional { data: string (base64), mimeType: string }
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();

    // Build parts for multimodal or text-only image generation
    const parts: any[] = [];

    // If a reference image is supplied for image-to-image editing or variation
    if (referenceImage && referenceImage.data) {
      // Remove any data URL prefix if present
      let cleanBase64 = referenceImage.data;
      let mimeType = referenceImage.mimeType || "image/jpeg";
      
      if (cleanBase64.includes(",")) {
        const [header, body] = cleanBase64.split(",");
        cleanBase64 = body;
        const match = header.match(/data:([^;]+);base64/);
        if (match) mimeType = match[1];
      }

      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    // Add the prompt text
    parts.push({
      text: prompt,
    });

    // Supported aspect ratios: "1:1", "3:4", "4:3", "9:16", "16:9", "21:9" (for pro: "1:4", "1:8", "4:1", "8:1")
    // Ensure aspectRatio is valid
    const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    // Supported sizes for gemini-3-pro-image-preview: "1K", "2K", "4K"
    const validSizes = ["1K", "2K", "4K"];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : "1K";

    // Call generateContent with imageConfig
    const response = await ai.models.generateContent({
      model: model || "gemini-3-pro-image-preview",
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: chosenAspectRatio,
          imageSize: chosenSize,
        },
      },
    });

    // Extract generated image
    let generatedImageUrl: string | null = null;
    let descriptionText = "";

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          generatedImageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({
        error: "The model did not return an image. It may have generated a textual refusal or safety block.",
        details: descriptionText || "No image part found in model response.",
      });
    }

    return res.json({
      imageUrl: generatedImageUrl,
      prompt,
      model,
      imageSize: chosenSize,
      aspectRatio: chosenAspectRatio,
      timestamp: Date.now(),
      notes: descriptionText,
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    const errorMessage = error?.message || "An error occurred during image generation.";
    return res.status(500).json({
      error: errorMessage,
      details: error?.statusText || error?.stack || String(error),
    });
  }
});

// Vite middleware or production static serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
