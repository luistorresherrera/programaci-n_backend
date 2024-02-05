import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
      },
    ],
    required: false,
  },
  id: { type: Number, required: true, unique: true, index: true },
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

cartsSchema.pre("find", function () {
  this.populate("products.product");
});

cartsSchema.plugin(mongoosePaginate);
const cartModel = mongoose.model(cartsCollection, cartsSchema);

export default cartModel;
