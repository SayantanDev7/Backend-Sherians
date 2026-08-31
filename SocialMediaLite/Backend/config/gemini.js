import { GoogleGenAI } from "@google/genai";

// Create a connection/client that can communicate with Google's Gemini API using my API key

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Export the model name here so there's one place to update when Google deprecates it
export const GEMINI_MODEL = "gemini-3.6-flash";

export default client;
