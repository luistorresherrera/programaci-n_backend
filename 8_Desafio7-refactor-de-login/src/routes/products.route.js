import { Router } from "express";

const router = Router();

import productModel from "../models/products.model.js";
import MongoProductManager from "../dao/MongoDb/product_manager.js";

//TRAER UN PRODUCTO ESPECÍFICO POR EL ID DEL PRODUCTO
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const prod = new MongoProductManager();

    const products = await prod.getProduct(pid);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
});

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
router.get("/", async (req, res) => {
  try {
    let { limit = 10, pageSearch = 1, sort, query } = req.query;

    // Validar query
    if (!query) {
      query = "";
    }

    let doSort = "";
    //validar sort
    if (!sort || (sort != "asc" && sort != "desc")) {
      doSort = null;
    } else {
      doSort = { price: sort };
    }

    let {
      docs,
      status,
      totalPages,
      prevLink,
      nextLink,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
    } = await productModel.paginate(
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },

          { code: { $regex: query, $options: "i" } },
        ],
      },
      {
        limit,
        page: pageSearch,
        sort: doSort,
        lean: true,
      }
    );

    if (prevPage) {
      prevLink =
        "../products?pageSearch=" +
        prevPage +
        "&limit=" +
        limit +
        "&sort=" +
        sort +
        "&query=" +
        query;
    }
    if (nextPage) {
      nextLink =
        "../products?pageSearch=" +
        nextPage +
        "&limit=" +
        limit +
        "&sort=" +
        sort +
        "&query=" +
        query;
    }

    res.status(200).send({
      docs,
      status,
      totalPages,
      prevLink,
      nextLink,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
    });
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
    const prod = new MongoProductManager();
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
  const prod = new MongoProductManager();

  res.send(await prod.activateProduct(pid));
});

//ACTUALIZAR UN PRODUCTO DESDE EL ID MODIFICANDO SUS CAMPOS QUE VIENEN EN BODY
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const modifierObject = req.body;
  const prod = new MongoProductManager();

  res.send(await prod.updateCompleteProduct(pid, modifierObject));
});

//ELIMINAR PRODUCTO DEL CARRITO, ÚNICAMENTE CAMBIARÁ EL STATUS DE TRUE (1) A FALSE (0)
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const prod = new MongoProductManager();

  res.send(await prod.deleteProduct(pid));
});

export default router;
