import { Router } from "express";
const router = Router();
import CartManager from "../../src/cart_manager.js";
const fileData = "./data/carts.json";
const fileDataProducts = "./data/products.json";
import ProductManager from "../product_manager.js";
import { isObject } from "util";

// //QUERY PARA TRAER PRODUCTOS CON LÍMITE DE ITEMS
// router.get("/query", (req, res) => {
//   // traigo la variable limit del query de la URL
//   const { limit } = req.query;

//   try {
//     //valido que los números menores de 1 me devuelvan un array vacío
//     if (parseInt(limit) < 1) {
//       console.log(
//         "Cuando el límite solicitado es menor a 1, entonces el resultado siempre será vacío."
//       );
//       return res.send([]);
//       // En caso de ser el limite 1 o más, entonces buscar la cantidad de productos
//     } else {
//       const prod = new ProductManager(fileData);
//       const productosAMostrar = [];
//       const showProducts = async () => {
//         const productosArchivados = await prod.getProducts();
//         // si el límite es mayor a la longitud del array de objetos, entonces devuélveme la longitud del array como límite
//         let limite =
//           limit <= productosArchivados.length
//             ? parseInt(limit) - 1
//             : productosArchivados.length - 1;

//         for (let i = 0; i <= limite; i++) {
//           productosAMostrar.push(productosArchivados[i]);
//         }
//         return res.send(productosAMostrar);
//       };
//       showProducts();
//     }
//   } catch (error) {
//     return res.send(error);
//   }
// });

// //TRAER UN PRODUCTOS ESPECÍFICO POR EL ID DEL PRODUCTO
// router.get("/:pid", (req, res) => {
//   const { pid } = req.params;
//   const prod = new ProductManager(fileData);

//   const showProduct = async () => {
//     res.send(await prod.getProductsById(pid));
//   };

//   showProduct();
// });

// //TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
// router.get("/", (req, res) => {
//   const prod = new ProductManager(fileData);
//   const showProducts = async () => {
//     res.send(await prod.getProducts());
//   };

//   showProducts();
// });

//CREAR UN CARRITO DE COMPRAS
router.post("/", (req, res) => {
  const cart = new CartManager(fileData);

  const addCart = async () => {
    res.send(await cart.createCart());
  };

  addCart();
});

//AGREGAR UN PRODUCTO AL CARRTO DE COMPRAS
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
    console.log(`El producto ${pid} no existe`);
    return `El producto ${pid} no existe`;
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
      console.log(`Se agregó una unidad al producto ${pid} del carrito ${cid}`);
      return `Se agregó una unidad al producto ${pid} del carrito ${cid}`;
    } else {
      arrayCart[indexCart].products.push({ product: pid, quantity: 1 });
      cart.grabarCartsEnArchivo(arrayCart);
      console.log(`Se agregó el producto ${pid} del carrito ${cid}`);
      return `Se agregó el producto ${pid} del carrito ${cid}`;
    }
  } else {
    console.log(`El carrito ${cid} no existe`);
    return `El carrito ${cid} no existe`;
  }
});

// //ACTUALIZAR UN PRODUCTO DESDE EL ID MODIFICANDO SUS CAMPOS QUE VIENEN EN BODY
// router.put("/modify/:pid", (req, res) => {
//   const { pid } = req.params;
//   const modifierObject = req.body;
//   const prod = new ProductManager(fileData);
//   const modifyProduct = async () => {
//     res.send(await prod.updateCompleteProduct(pid, modifierObject));
//   };

//   modifyProduct();
// });

// //ELIMINAR PRODUCTO DEL CARRITO, ÚNICAMENTE CAMBIARÁ EL STATUS DE TRUE (1) A FALSE (0)
// router.delete("/delete/:pid", (req, res) => {
//   const { pid } = req.params;
//   const prod = new ProductManager(fileData);
//   const deleteProduct = async () => {
//     res.send(await prod.deleteProduct(pid));
//   };

//   deleteProduct();
// });

export default router;
