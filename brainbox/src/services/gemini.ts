import { GoogleGenAI } from "@google/genai";

export async function generateGeminiResponse(prompt: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview", // Latest model for API users
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateBasicResponse(prompt: string, targetModelName: string) {
  // Use the platform-provided free key for basic requests
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview", // Free/Lite model
      contents: prompt,
      config: {
        systemInstruction: `You are acting as ${targetModelName}. Respond in the style and manner of ${targetModelName}. Keep responses concise and helpful.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Basic Model Error:", error);
    throw error;
  }
}
