import { Router } from "express";
const router = Router();
import CartManager from "../../src/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../product_manager.js";

// //TRAER TODOS LOS CARTS EXISTENTES
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = new CartManager(fileData);
  const cartsArray = await cart.getCarts();
  const cartIndex = cartsArray.findIndex((cart) => cart.id == cid);
  if (cartIndex == -1) {
    return res.status(404).send({ error: "Cart no encontrado" });
  }

  return res.status(200).send(cartsArray[cartIndex].products);
});

//CREAR UN CARRITO DE COMPRAS
router.post("/", async (req, res) => {
  const cart = new CartManager(fileData);

  res.status(200).send(await cart.createCart());
});

//AGREGAR UN PRODUCTO AL CARRITO DE COMPRAS
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Traer el arrar de carts que existe en el archivo
  const cart = new CartManager(fileData);

  const arrayCart = await cart.getCarts();
  // Validar si el producto que quieren agregar existe
  const prod = new ProductManager(fileDataProducts);
  const typeReturn = typeof (await prod.getProductsById(pid));
  // Si no existe el producto en el archivo de productos no debe permitir continuar.
  if (typeReturn != "object") {
    return res.status(404).send(`El producto ${pid} no existe`);
  }

  //Encuentra el index del carrito
  const indexCart = arrayCart.findIndex((item) => item.id == cid);
  // si el carrito si existe, entonces busca en el array product dentro de ese objeto
  if (indexCart != -1) {
    if (arrayCart[indexCart].products.find((item) => item.product == pid)) {
      const indexProductOnCart = arrayCart[indexCart].products.findIndex(
        (item) => item.product == pid
      );
      console.log(arrayCart[indexCart].products[indexProductOnCart].quantity++);
      cart.grabarCartsEnArchivo(arrayCart);

      return res
        .status(200)
        .send(`Se agregó una unidad al producto ${pid} del carrito ${cid}`);
    } else {
      arrayCart[indexCart].products.push({ product: pid, quantity: 1 });
      cart.grabarCartsEnArchivo(arrayCart);

      return res
        .status(200)
        .send(`Se agregó el producto ${pid} del carrito ${cid}`);
    }
  } else {
    return res.status(404).send(`El carrito ${cid} no existe`);
  }
});

export default router;
