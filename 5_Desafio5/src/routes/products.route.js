import { Router } from "express";
const router = Router();
import ProductManager from "../dao/FileSystem/product_manager.js";
const fileData = "./data/products.json";
import productModel from "../models/products.model.js";
import MongoProductManager from "../dao/MongoDb/product_manager.js";

//QUERY PARA TRAER PRODUCTOS CON LÍMITE DE ITEMS
router.get("/query", async (req, res) => {
  // traigo la variable limit del query de la URL
  const { limit } = req.query;

  //valido que los números menores de 1 me devuelvan un array vacío
  if (parseInt(limit) < 1) {
    return res
      .status(400)
      .send(
        "Cuando el límite solicitado es menor a 1, entonces el resultado siempre será vacío."
      );
    // En caso de ser el limite 1 o más, entonces buscar la cantidad de productos
  } else {
    try {
      const products = await productModel.find({}).limit(limit);
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
    }
  }
});

//TRAER UN PRODUCTOS ESPECÍFICO POR EL ID DEL PRODUCTO
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const products = await productModel.findOne({ id: pid });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
});

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
});

//TRAER TODOS LOS PRODUCTOS UTILIZANDO LOS PARAMETROS DE LA URL
router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.query;
    if (!title || !description || !price || !code || !stock) {
      return res
        .status(400)
        .send(
          "Debes colocar los campos title, description, price, thumbnail (opcional), code y stock para poder agregar el producto"
        );
    }
    const prod = new MongoProductManager(fileData);
    const productObject = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: 1,
    };

    const mongoResult = await prod.addProduct(productObject);

    res.status(200).send({ status: "success", detail: mongoResult });
  } catch (error) {
    console.log(error);
  }
});

//ACTIVAR PRODUCTO ELIMINADO
router.put("/activate/:pid", async (req, res) => {
  const { pid } = req.params;
  const prod = new MongoProductManager(fileData);

  res.send(await prod.activateProduct(pid));
});

//ACTUALIZAR UN PRODUCTO DESDE EL ID MODIFICANDO SUS CAMPOS QUE VIENEN EN BODY
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const modifierObject = req.body;
  const prod = new ProductManager(fileData);

  res.send(await prod.updateCompleteProduct(pid, modifierObject));
});

//ELIMINAR PRODUCTO DEL CARRITO, ÚNICAMENTE CAMBIARÁ EL STATUS DE TRUE (1) A FALSE (0)
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const prod = new ProductManager(fileData);

  res.send(await prod.deleteProduct(pid));
});

// //HACER QUE DESDE EL HOME, ACCEDA A TODOS LOS PRODUCTOS
// router.delete("/:pid", async (req, res) => {
//   const { pid } = req.params;
//   const prod = new ProductManager(fileData);

//   res.send(await prod.deleteProduct(pid));
// });

export default router;
