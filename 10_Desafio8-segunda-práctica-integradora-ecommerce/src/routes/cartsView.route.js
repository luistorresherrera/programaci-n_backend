import { Router } from "express";
const router = Router();
import CartManager from "../dao/FileSystem/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../dao/FileSystem/product_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import cartModel from "../models/carts.model.js";
import auth from "../middleware/authentication.middleware.js";
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";

const { generateToken, authTokenMiddleware } = jsonwebtokenFunctions;

// //TRAER UN CART POR ID
router.get("/", authTokenMiddleware, async (req, res) => {
  const cid = req.user.cart;
  const prod = new MongoCartManager();

  const cart = await prod.getCart({ _id: cid });

  res.render("cart", { result: cart.products });
});

export default router;
