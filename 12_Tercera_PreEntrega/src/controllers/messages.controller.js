import MongoMessageManager from "../dao/MongoDb/message_manager.mongo.js";

class messagesController {
  constructor() {}

  async recieveMessage(req, res) {
    try {
      const messages = new MongoMessageManager();

      return res.status(200).send(await messages.getMessages());
    } catch (error) {
      return console.log(error);
    }
  }

  async sendMessage(req, res) {
    try {
      const messageObject = req.body;
      const message = new MongoMessageManager();

      return res
        .status(200)
        .send(
          await message.sendMessage(messageObject.email, messageObject.message)
        );
    } catch (error) {
      return console.log(error);
    }
  }
}
export default messagesController;
