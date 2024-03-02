import mongoose from "mongoose";
import dotenv from "dotenv";
import program from "../utils/commander.js";

dotenv.config();

const configObject = {
  port: process.env.PORT || 8080,
  jwt_secret_Key: process.env.JWT_SECRET_KEY,
};

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://luistorresAdmin:La08081989$@codercluster.po3gvlq.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
};

export default { connectDB, configObject };
