import { Router } from "express";

const router = Router();

import productsController from "../controllers/products.controller.js";

const { getProduct, getProducts } = new productsController();

//TRAER UN PRODUCTO ESPECÍFICO POR EL ID DEL PRODUCTO
router.get("/:pid", getProduct);

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
router.get("/", getProducts);

export default router;
