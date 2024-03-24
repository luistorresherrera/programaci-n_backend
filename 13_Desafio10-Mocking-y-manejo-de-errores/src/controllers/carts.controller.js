import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import MongoUserManager from "../dao/MongoDb/user_manager.js";

class cartsController {
  constructor() {}

  async getCart(req, res) {
    const cid = req.user.cart;
    const cart = new MongoCartManager();

    return res.status(200).send(await cart.getCart(cid));
  }

  async createCart(req, res) {
    const cart = new MongoCartManager();
    const user = new MongoUserManager();

    req.session.cart = cartResult._id;
    res.status(200).send(cartResult);
  }

  async addProductToCart(req, res) {
    const { pid } = req.params;
    const cid = req.user.cart;

    const cart = new MongoCartManager();
    if (cid != undefined) {
      const result = await cart.addProductToCart(cid, pid);
      return res.status(200).send(result);
    }
  }

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    // Traer el arrar de carts que existe en el archivo
    const cart = new MongoCartManager();
    const result = await cart.deleteProductoFromCart(cid, pid);
    return res.status(200).send(result);
  }

  async deleteAllProductsFromCart(req, res) {
    const { cid } = req.params;

    // Traer el arrar de carts que existe en el archivo
    const cart = new MongoCartManager();
    const result = await cart.deleteAllProductsFromCart(cid);
    return res.status(200).send(result);
  }

  async updateCart(req, res) {
    const { cid, pid } = req.params;
    const cantidadProd = req.body;

    const cart = new MongoCartManager();
    const result = await cart.updateQuantityOfProductOnCart(
      cid,
      pid,
      cantidadProd
    );
    return res.status(200).send(result);
  }

  async updateProductsOnCart(req, res) {
    const { cid } = req.params;
    const productsArray = req.body;

    const cart = new MongoCartManager();
    const result = await cart.updateProductsOnCart(cid, productsArray);
    return res.status(200).send(result);
  }
}

export default cartsController;
