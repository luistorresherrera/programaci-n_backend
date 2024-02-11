import mongoose from "mongoose";

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

export default connectDB;
