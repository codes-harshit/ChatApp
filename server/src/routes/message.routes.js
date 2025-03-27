import { Router } from "express";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const messageRoutes = Router();

messageRoutes.get("/users", protectRoute, getAllUsers);

messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;
