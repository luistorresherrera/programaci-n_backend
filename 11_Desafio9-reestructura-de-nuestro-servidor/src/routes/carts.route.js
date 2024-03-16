import { Router } from "express";
const router = Router();

import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
import cartsController from "../controllers/carts.controller.js";

const { generateToken, authTokenMiddleware } = jsonwebtokenFunctions;

const {
  getCart,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  updateCart,
  updateProductsOnCart,
} = new cartsController();

// //TRAER UN CART POR ID
router.get("/", authTokenMiddleware, getCart);

//CREAR UN CARRITO DE COMPRAS
router.post("/", authTokenMiddleware, createCart);

//AGREGAR UN PRODUCTO AL CARRITO DE COMPRAS
router.post("/product/:pid", authTokenMiddleware, addProductToCart);

//ELIMINAR UN PRODUCTO AL CARRITO DE COMPRAS
router.delete("/:cid/product/:pid", authTokenMiddleware, deleteProductFromCart);

//ELIMINAR TODOS LOS PRODUCTOS DE UN CARRITO
router.delete("/:cid", authTokenMiddleware, deleteAllProductsFromCart);

//ACTUALIZAR LA CANTIDAD DE UN PRODUCTO DE UN CARRITO PASANDO POR REQ.BODY
router.put("/:cid/product/:pid", authTokenMiddleware, updateCart);

//ACTUALIZAR UN CARRITO CON UN ARREGLO DE PRODUCTOS
router.put("/:cid", authTokenMiddleware, updateProductsOnCart);

export default router;
