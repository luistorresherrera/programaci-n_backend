import { Router } from "express";
const router = Router();
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
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
