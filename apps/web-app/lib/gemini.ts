import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from '@brainbox/utils'

export async function generateGeminiResponse(prompt: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini', 'generateGeminiResponse failed', error)
    throw error;
  }
}

export async function generateBasicResponse(prompt: string, targetModelName: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are acting as ${targetModelName}. Respond in the style and manner of ${targetModelName}. Keep responses concise and helpful.`,
  });
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini', 'generateBasicResponse failed', error)
    throw error;
  }
}
