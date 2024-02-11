import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: { type: Array, required: false },
  id: { type: Number, required: true, unique: true },
});

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export default cartModel;
