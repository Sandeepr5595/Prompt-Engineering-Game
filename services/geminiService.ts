
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }
    if (typeof apiKey !== 'string') {
      throw new Error("API_KEY_INVALID_TYPE: The API_KEY environment variable must be a string.");
    }
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
  return ai;
};

export interface GeminiResponse {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export const generateGeminiResponse = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const client = getAIClient();
    const result: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt, // Simplified contents for a single text prompt
      config: {
        // Temperature could be adjusted based on the task for more/less creativity
        temperature: 0.7, 
        topP: 0.95,
        topK: 64,
        // Using thinkingConfig with thinkingBudget: 0 for lower latency, as specified for game AI opponents.
        // However, for creative tasks like story generation, default thinking might be better.
        // For this learning game, faster response is prioritized.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    const text = result.text;
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks as GroundingChunk[] || undefined;

    return { text, groundingChunks };

  } catch (error: any) {
    if (error.message === "API_KEY_MISSING" || error.message === "API_KEY_INVALID_TYPE") {
      throw error; // Re-throw specific error for UI handling
    }
    console.error("Error calling Gemini API:", error);
    // More specific error handling can be added here
    if (error.message && error.message.includes("API key not valid")) {
       throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
    // Check for the specific error message the user encountered
    if (error.message && error.message.includes("name contains invalid characters")) {
        console.error("Gemini API Error: ", error.message);
        throw new Error("There was an issue with the request structure. Please try again. Details: " + error.message);
    }
    throw new Error("Failed to get response from AI. Please try again.");
  }
};
