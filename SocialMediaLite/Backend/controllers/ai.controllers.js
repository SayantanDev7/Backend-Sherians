import fs from "node:fs";
import client from "../config/gemini.js";

export const generateCaption = async (req, res) => {
    try {
        // Check if an image was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image",
            });
        }

        // Convert image to Base64
        const base64Image = fs.readFileSync(req.file.path, {
            encoding: "base64",
        });

        // Send image + instruction to Gemini
        const interaction = await client.interactions.create({
            model: "gemini-3.7-flash",

            input: [
                {
                    type: "text",
                    text: "Generate a short, natural and engaging caption for this image. Describe only what is visible in the image.",
                },
                {
                    type: "image",
                    data: base64Image,
                    mime_type: req.file.mimetype,
                },
            ],
        });

        // Delete temporary uploaded file
        fs.unlinkSync(req.file.path);

        // Send Gemini's response to frontend
        return res.status(200).json({
            caption: interaction.output_text,
        });

    } catch (error) {
        console.error("AI Caption Error:", error);

        return res.status(500).json({
            message: "Failed to generate caption",
        });
    }
};