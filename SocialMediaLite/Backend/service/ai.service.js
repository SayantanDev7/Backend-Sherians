// Frontend
//    ↓
// Express Backend
//    ↓
// Gemini API
//    ↓
// AI Response
//    ↓
// Express Backend
//    ↓
// Frontend

import { GoogleGenAI } from "@google/genai"; //importing a class/function from Google's Gemini SDK 
// i.e Give me the Google Gemini AI functionality
// @google/genai is a package provided by google to communcate with google's gemini ai

const ai = new GoogleGenAI(
    { apiKey: process.env.GEMINI_API_KEY }
); // Here is my API key. Use this key when communicating with Google's servers

// The create method sends a request to the Gemini API to generate content based on the input prompt.

// You can think of an interaction as:

// Request to AI
//       +
// AI's response
const interaction = await ai.interactions.create({
  model: "gemini-3.7-flash", //model specifies which Gemini model to use
  input: "Explain how AI works in a few words", //input is the prompt that is sent to the AI model
});

// The output_text property contains the generated response from the AI model.
console.log(interaction.output_text);