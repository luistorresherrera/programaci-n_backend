import mongoose from "mongoose";
import dotenv from "dotenv";
import program from "../utils/commander.js";

dotenv.config();

const configObject = {
  port: process.env.PORT,
  jwt_secret_Key: process.env.JWT_SECRET_KEY,
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
};

export default { connectDB, configObject };
