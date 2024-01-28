import mongoose from "mongoose";

const productsCollection = "products";
const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  thumbnail: { type: String, required: false },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  id: { type: Number, required: true, unique: true },
  status: { type: Number, required: true },
});

const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;
