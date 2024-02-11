//---->CÓDIGO DEL EJERCICIO<------

import messageModel from "../../models/messages.model.js";

//Creación de clase MessageManager
class MongoMessageManager {
  constructor() {}

  //Método crear mensaje
  async sendMessage(email, message) {
    try {
      if (
        !email ||
        !message ||
        email.trim() == "" ||
        message.trim() == "" ||
        !email.includes("@")
      ) {
        return {
          status: 400,
          message: "Debe tener email y un mensaje.",
        };
      }
      messageModel.create({
        id: await messageModel.find({}).countDocuments({}),
        message: message,
        email: email,
      });

      return {
        status: 200,
        detail: "Mensaje enviado.",
        user: email,
        message: message,
      };
    } catch (error) {
      return "Hemos encontrado un error: ", error;
    }
  }

  //Método para obtener todos los mensajes
  async getMessages() {
    try {
      const messages = await messageModel.find({});
      return messages;
    } catch (err) {
      return console.log("Hubo un error: ", err);
    }
  }
}

export default MongoMessageManager;
