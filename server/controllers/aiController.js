import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env is loaded

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const generateAIResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "messages must be a non-empty array" });
    }

    // Validate API Key
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ success: false, message: "GEMINI_API_KEY is not set in .env" });
    }

    // Convert to Gemini-compatible format
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const payload = { contents };

    // Debug logs
    console.log("✅ Payload to Gemini:", JSON.stringify(payload, null, 2));
    console.log("🔑 API Key present:", !!GEMINI_API_KEY);

    // Send request to Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // Success
    res.json({ success: true, reply: aiReply });
  } catch (error) {
    // Detailed Gemini error logging
    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data || error.message;

    console.error("❌ Gemini API Error:", statusCode, JSON.stringify(responseData, null, 2));

    res.status(500).json({
      success: false,
      message: "AI request failed",
      error: responseData,
    });
  }
};
