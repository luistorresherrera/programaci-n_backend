import { Router } from "express";

const router = Router();
import MongoProductManager from "../dao/MongoDb/product_manager.js";
import productModel from "../models/products.model.js";
import auth from "../middleware/authentication.middleware.js";

//PRODUCT DETAIL
router.get("/:pid", auth, async (req, res) => {
  try {
    const { pid } = req.params;

    let { docs } = await productModel.paginate(
      {
        _id: pid,
      },
      { lean: true }
    );

    res.render("product_detail", {
      products: docs,
    });
  } catch (error) {
    console.log(error);
  }
});

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
router.get("/", auth, async (req, res) => {
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

    res.render("products", {
      products: docs,
      status,
      totalPages,
      prevLink,
      nextLink,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page,
      // userName: `${req.session.user.first_name} ${req.session.user.last_name}`,
      // role: req.session.user.role,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
