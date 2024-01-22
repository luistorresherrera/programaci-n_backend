import mongoose from "mongoose";

const messagesCollection = "messages";
const messagesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
});

const messageModel = mongoose.model(messagesCollection, messagesSchema);

export default messageModel;
