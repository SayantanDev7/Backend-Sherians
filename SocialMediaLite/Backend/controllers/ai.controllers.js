import client, { GEMINI_MODEL } from "../config/gemini.js";

// ─────────────────────────────────────────────────────────────
// WHY models.generateContent() and NOT interactions.create()?
//
//  interactions.create() → newer Interactions API
// generateContent() → standard Gemini content-generation API

// For this project, generateContent() works correctly with our
// GEMINI_API_KEY and is sufficient for one-shot image captioning.
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

        // Convert image buffer to Base64 string directly from memory
        // With multer memoryStorage(), the file lives in req.file.buffer (no disk I/O)
        //
        //   req.file.buffer (raw bytes in RAM)
        //              ↓
        //        Base64 string
        //      Gemini can then receive that image data directly.

        const base64Image = req.file.buffer.toString("base64");

        // Send image + prompt to Gemini using the standard generateContent API
        // contents → array of "turns" in the conversation (just one turn here)
        // parts   → what this turn contains: a text prompt + an inline image

        //response contains the AI generated content and API metadata
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

        // response.text is a convenience getter that returns the generated text directly
        return res.status(200).json({
            caption: response.text,
        });

    } catch (error) {
        console.error("AI Caption Error:", error);

        return res.status(500).json({
            message: "Failed to generate caption",
        });
    }
};
