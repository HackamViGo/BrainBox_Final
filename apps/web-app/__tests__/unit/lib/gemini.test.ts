import { describe, it, expect, vi } from 'vitest';
import { generateGeminiResponse, generateBasicResponse } from '../../../lib/gemini';

// Mock the GoogleGenerativeAI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: async () => ({
            response: {
              text: () => "Mocked Gemini Response"
            }
          })
        };
      }
    }
  };
});

describe('gemini utility', () => {
  it('generateGeminiResponse should return mocked text', async () => {
    const result = await generateGeminiResponse("Test prompt", "mock-api-key");
    expect(result).toBe("Mocked Gemini Response");
  });

  it('generateBasicResponse should return mocked text', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
    const result = await generateBasicResponse("Test prompt", "gpt-4o");
    expect(result).toBe("Mocked Gemini Response");
  });

  it('generateBasicResponse should throw if no API key', async () => {
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    await expect(generateBasicResponse("Test prompt", "gpt-4o")).rejects.toThrow("GEMINI_API_KEY is not configured");
  });
});
