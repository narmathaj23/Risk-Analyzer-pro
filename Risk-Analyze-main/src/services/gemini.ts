import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ContentType, Platform } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function analyzeContent(
  platform: Platform,
  content: {
    text?: string;
    files?: { data: string; mimeType: string; type: ContentType }[];
  }
): Promise<AnalysisResult> {
  const ai = getAI();
  const model = "gemini-1.5-flash"; 

  const prompt = `
    Analyze the following content for copyright risks when posting to ${platform}.
    Provide a detailed risk assessment in JSON format.
    
    Consider:
    - Text: Plagiarism, trademarks, copyrighted phrases.
    - Images: Logos, characters, watermarks, similarity to famous works.
    - Video/Audio: Background music, visual scenes, brand logos.
    
    The response MUST be a valid JSON object matching this schema:
    {
      "riskScore": number (0-100),
      "riskLevel": "Low" | "Medium" | "High",
      "confidence": number (0-100),
      "breakdown": [
        {
          "type": "text" | "image" | "video" | "audio",
          "score": number (0-100),
          "details": "string",
          "risks": ["string"]
        }
      ],
      "recommendations": [
        {
          "title": "string",
          "description": "string",
          "action": "string"
        }
      ],
      "safeVersion": "string (optional, suggested edits)",
      "explanation": "string"
    }
  `;

  const parts: any[] = [{ text: prompt }];

  if (content.text) {
    parts.push({ text: `Text Content: ${content.text}` });
  }

  if (content.files) {
    content.files.forEach((file) => {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType,
        },
      });
    });
  }

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.text || "{}";
    // Clean up potential markdown formatting in case the model returns it despite the config
    const cleanedText = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
}
