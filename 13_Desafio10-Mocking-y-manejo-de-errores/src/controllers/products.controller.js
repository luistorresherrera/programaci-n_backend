import MongoProductManager from "../dao/MongoDb/product_manager.js";
import productModel from "../models/products.model.js";

class productsController {
  constructor() {}

  async getProduct(req, res) {
    const { pid } = req.params;
    try {
      const prod = new MongoProductManager();

      const products = await prod.getProduct(pid);
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(req, res) {
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
  }
}

export default productsController;
