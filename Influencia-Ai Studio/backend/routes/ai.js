const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// Connect to Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// AI CHAT ROUTE
router.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        // Validate input
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        if (prompt.length > 4000) {
            return res.status(400).json({
                error: "Message is too long."
            });
        }

        // Generate AI response
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            success: false,
            error: "AI request failed. Please try again."
        });
    }
});

module.exports = router;