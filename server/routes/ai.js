import express from "express";
import { protectRoute } from "../middleware/auth.js"; // keeps it secure
import { generateAIResponse } from "../controllers/aiController.js";

const aiRouter = express.Router();

// POST /api/ai/generate
aiRouter.post("/generate",  generateAIResponse);

export default aiRouter;
