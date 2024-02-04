import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
        id: { type: Number },
      },
    ],
    required: false,
  },
  id: { type: Number, required: true, unique: true, index: true },
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export default cartModel;
