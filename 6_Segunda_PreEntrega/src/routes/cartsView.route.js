import { Router } from "express";
const router = Router();
import CartManager from "../dao/FileSystem/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../dao/FileSystem/product_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import cartModel from "../models/carts.model.js";

// //TRAER UN CART POR ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const prod = new MongoCartManager();

  const cart = await prod.getCart(cid);

  const cartLocal = [
    { id: 1, product: { vehiculo: "carro", color: "rojo" }, cantidad: 4 },
    { id: 2, product: { vehiculo: "suv", color: "azul" }, cantidad: 2 },
    { id: 3, product: { vehiculo: "moto", color: "blanco" }, cantidad: 3 },
    { id: 4, product: { vehiculo: "bus", color: "negro" }, cantidad: 5 },
  ];

  console.log("----------------------------------");
  console.log({ result: cart.products });
  console.log("----------------------------------");
  // console.log({ result: cartLocal });
  res.render("cart", { result: cart.products });
});

export default router;
