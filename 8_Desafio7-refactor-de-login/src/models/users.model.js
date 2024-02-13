import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersCollection = "users";
const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true, uppercase: true },
  last_name: { type: String, required: true, uppercase: true },
  birthdate: { type: Date, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const userModel = mongoose.model(usersCollection, usersSchema);

export default userModel;
