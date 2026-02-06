import { GoogleGenAI } from "@google/genai";

// Ensure we only initialize if API key is likely available to avoid immediate script crashes
const getAI = () => {
  const apiKey = typeof process !== 'undefined' && process.env.API_KEY ? process.env.API_KEY : '';
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const ai = getAI();

/**
 * Generates a cryptic but helpful hint for a team stuck on a puzzle.
 */
export const generateAIHint = async (
  eraTheme: string,
  puzzleDescription: string,
  teamName: string
): Promise<string> => {
  if (!ai) return "Uplink disconnected. Temporal distortion prevents AI assistance.";
  
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are a futuristic Time Travel AI assisting the Game Master of an escape room game.
      The team "${teamName}" is stuck in the "${eraTheme}" era on a puzzle described as: "${puzzleDescription}".
      
      Generate a short, atmospheric, sci-fi style hint (max 1 sentence). 
      Do not give the answer directly. Be helpful but cryptic.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Communication interference detected. Try again.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "The timeline is fuzzy. Look closely at the clues provided.";
  }
};

/**
 * Generates flavor text for the Game Master to read when an era unlocks.
 */
export const generateEraIntro = async (eraTitle: string, year: string): Promise<string> => {
  if (!ai) return "Time jump initiated. Prepare for turbulence.";

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Write a 2-sentence dramatic intro for a time travel mission to: "${eraTitle}" in the year "${year}".
      The tone should be urgent and sci-fi.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Time jump initiated. Prepare for turbulence.";
  } catch (error) {
    return "Time jump initiated. Prepare for turbulence.";
  }
};