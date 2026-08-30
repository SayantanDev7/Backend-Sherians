import fs     from "node:fs";
import client, { GEMINI_MODEL } from "../config/gemini.js";

// ─────────────────────────────────────────────────────────────
// WHY models.generateContent() and NOT interactions.create()?
//
// interactions.create() → "Live API" (real-time streaming)
//   Requires full Google Cloud / Vertex AI credentials (not just an API key)
//   That's why you got "Could not load the default credentials" error.
//
// models.generateContent() → standard REST API
//   Works with a plain GEMINI_API_KEY from .env ✅
//   Correct method for one-shot text + image generation tasks.
// ─────────────────────────────────────────────────────────────

export const generateCaption = async (req, res) => {
    try {
        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image",
            });
        }

        // Convert image file buffer to Base64 string
        // Gemini expects images as Base64-encoded strings, not raw binary
        const base64Image = fs.readFileSync(req.file.path, {
            encoding: "base64",
        });

        // Send image + prompt to Gemini using the standard generateContent API
        // contents → array of "turns" in the conversation (just one turn here)
        // parts   → what this turn contains: a text prompt + an inline image
        const response = await client.models.generateContent({
            model   : GEMINI_MODEL,  // defined in config/gemini.js — update there if deprecated again
            contents: [
                {
                    parts: [
                        {
                            // Text prompt telling Gemini what to do with the image
                            text: "Generate a short, natural and engaging caption for this image. Describe only what is visible in the image.",
                        },
                        {
                            // inlineData → raw image sent directly in the request (no URL needed)
                            inlineData: {
                                mimeType: req.file.mimetype, // e.g. "image/jpeg"
                                data    : base64Image,       // Base64 encoded image bytes
                            },
                        },
                    ],
                },
            ],
        });

        // Delete the temp file from disk now that we're done with it
        fs.unlinkSync(req.file.path);

        // response.text is a convenience getter that returns the generated text directly
        return res.status(200).json({
            caption: response.text,
        });

    } catch (error) {
        console.error("AI Caption Error:", error);

        // Clean up temp file even if Gemini call failed
        if (req.file?.path) {
            try { fs.unlinkSync(req.file.path); } catch (_) {}
        }

        return res.status(500).json({
            message: "Failed to generate caption",
        });
    }
};
