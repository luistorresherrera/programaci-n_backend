import { Router } from "express";
const router = Router();

import MongoMessageManager from "../dao/MongoDb/message_manager.js";

// Traer mensajes
router.get("/", async (req, res) => {
  try {
    const messages = new MongoMessageManager();

    return res.status(200).send(await messages.getMessages());
  } catch (error) {
    return console.log(error);
  }
});

// Enviar mensaje
router.post("/", async (req, res) => {
  const messageObject = req.body;
  const message = new MongoMessageManager();

  return res
    .status(200)
    .send(
      await message.sendMessage(messageObject.email, messageObject.message)
    );
});

export default router;

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const modifierObject = req.body;
  const prod = new MongoProductManager();

  res.send(await prod.updateCompleteProduct(pid, modifierObject));
});
