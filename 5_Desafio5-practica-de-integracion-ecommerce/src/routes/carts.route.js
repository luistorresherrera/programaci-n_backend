import { Router } from "express";
const router = Router();
import CartManager from "../dao/FileSystem/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../dao/FileSystem/product_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";

// //TRAER UN CART POR ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = new MongoCartManager();

  return res.status(200).send(await cart.getCart(cid));
});

// //TRAER TODOS LOS CARTS EXISTENTES
router.get("/", async (req, res) => {
  const cart = new MongoCartManager();
  const result = await cart.getCarts();

  return res.status(200).send(result);
});

//CREAR UN CARRITO DE COMPRAS
router.post("/", async (req, res) => {
  const cart = new MongoCartManager();

  res.status(200).send(await cart.createCart());
});

//AGREGAR UN PRODUCTO AL CARRITO DE COMPRAS
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Traer el arrar de carts que existe en el archivo
  const cart = new MongoCartManager();
  const result = await cart.addProductToCart(cid, pid);
  return res.status(200).send(result);
});

export default router;
