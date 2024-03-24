import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";
const router = Router();

const { recieveMessage, sendMessage } = new messagesController();

// Traer mensajes
router.get("/", recieveMessage);

// Enviar mensaje
router.post("/", sendMessage);

export default router;
