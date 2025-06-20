import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage, deleteMessage, updateMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// New: delete and update message
messageRouter.delete("/:id", protectRoute, deleteMessage);
messageRouter.put("/:id", protectRoute, updateMessage);

messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;