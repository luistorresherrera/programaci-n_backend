import mongoose from "mongoose";

const usersCollection = "users";
const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const userModel = mongoose.model(usersCollection, usersSchema);

module.exports = { userModel };
