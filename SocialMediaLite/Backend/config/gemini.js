import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Export the model name here so there's one place to update when Google deprecates it
export const GEMINI_MODEL = "gemini-3.6-flash";

export default client;
