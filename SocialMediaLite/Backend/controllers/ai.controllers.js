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
        //req.file contains the uploaded file as binary data or a temporary file reference, depending on how you configure Multer
        
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

        //Ask the Gemini model to generate a response based on the input I give it
        const response = await client.models.generateContent({
            model   : GEMINI_MODEL,  // defined in config/gemini.js — update there if deprecated again
            
            // contents --> What am I sending to Gemini?
            contents: [
                {
                    parts: [
                        {
                            // Text prompt telling Gemini what to do with the image
                            text: "Generate a short, natural and engaging caption for this image. Describe only what is visible in the image.",
                        },
                        {
                            // inlineData → I'm putting the actual image data directly inside this request
                            // raw image sent directly in the request (no URL needed)
                            inlineData: {
                                // It tells Gemini what type of file the Base64 data represents.
                                mimeType: req.file.mimetype, // e.g. "image/jpeg" i.e The Base64 data I'm sending is a JPEG image
                                data    : base64Image,       // Base64 encoded image bytes
                            },
                        },
                    ],
                },
            ],
            // config --> Additional settings that influence the model's response generation process.
            config: {
                // systemInstruction --> It sets the context or “role” for the AI.
                systemInstruction: `
                You are an expert social media caption writer.

                Your task is to analyze the uploaded image and create a caption for it.

                Rules:
                - Keep the caption short and engaging.
                - Describe only what is actually visible in the image.
                - Do not invent people, locations, events, emotions, or facts.
                - Make the caption sound natural and human, not robotic.
                - Match the mood and context of the image.
                - Avoid generic phrases like "Amazing picture!" unless appropriate.
                - Add 2-4 relevant hashtags.
                - Do not explain your reasoning.
                - Return only the final caption.
                `,
            },
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
