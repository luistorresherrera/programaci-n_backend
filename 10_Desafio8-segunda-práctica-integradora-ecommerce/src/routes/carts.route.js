import { Router } from "express";
const router = Router();
import CartManager from "../dao/FileSystem/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../dao/FileSystem/product_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import MongoUserManager from "../dao/MongoDb/user_manager.js";
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";

const { generateToken, authTokenMiddleware } = jsonwebtokenFunctions;

// //TRAER UN CART POR ID
router.get("/", authTokenMiddleware, async (req, res) => {
  const cid = req.user.cart;
  const cart = new MongoCartManager();

  return res.status(200).send(await cart.getCart(cid));
});

// //TRAER TODOS LOS CARTS EXISTENTES
// router.get("/", async (req, res) => {
//   const cart = new MongoCartManager();
//   const result = await cart.getCarts();

//   return res.status(200).send(result);
// });

//CREAR UN CARRITO DE COMPRAS
router.post("/", async (req, res) => {
  const cart = new MongoCartManager();
  const user = new MongoUserManager();
  const result = await user.authenticate({ email: req.session.email });
  const cartResult = await cart.createCart(result.user.resultFiltered.userID);
  req.session.cart = cartResult._id;
  res.status(200).send(cartResult);
});

//AGREGAR UN PRODUCTO AL CARRITO DE COMPRAS
router.post("/product/:pid", authTokenMiddleware, async (req, res) => {
  const { pid } = req.params;
  const cid = req.user.cart;

  const cart = new MongoCartManager();
  if (cid != undefined) {
    const result = await cart.addProductToCart(cid, pid);
    return res.status(200).send(result);
  }
});

//ELIMINAR UN PRODUCTO AL CARRITO DE COMPRAS
router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Traer el arrar de carts que existe en el archivo
  const cart = new MongoCartManager();
  const result = await cart.deleteProductoFromCart(cid, pid);
  return res.status(200).send(result);
});

//ELIMINAR TODOS LOS PRODUCTOS DE UN CARRITO
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  // Traer el arrar de carts que existe en el archivo
  const cart = new MongoCartManager();
  const result = await cart.deleteAllProductsFromCart(cid);
  return res.status(200).send(result);
});

//ACTUALIZAR LA CANTIDAD DE UN PRODUCTO DE UN CARRITO PASANDO POR REQ.BODY
router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cantidadProd = req.body;

  const cart = new MongoCartManager();
  const result = await cart.updateQuantityOfProductOnCart(
    cid,
    pid,
    cantidadProd
  );
  return res.status(200).send(result);
});

//ACTUALIZAR UN CARRITO CON UN ARREGLO DE PRODUCTOS
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const productsArray = req.body;

  const cart = new MongoCartManager();
  const result = await cart.updateProductsOnCart(cid, productsArray);
  return res.status(200).send(result);
});

export default router;
