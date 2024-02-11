//---->CÓDIGO DEL EJERCICIO<------

import cartModel from "../../models/carts.model.js";
import productModel from "../../models/products.model.js";

//Creación de clase CartManager
class MongoCartManager {
  constructor() {}

  //Método crear cart
  async createCart() {
    try {
      cartModel.create({
        id: await cartModel.find({}).countDocuments({}),
        products: [],
      });

      return "Se agregó el carrito correctamente.";
    } catch (error) {
      return "Hemos encontrado un error: ", error;
    }
  }

  //Método para obtener todos los carts

  async getCarts() {
    try {
      const carts = await cartModel.find({});
      return carts;
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }

  // Método para traer un solo cart a través del ID
  async getCart(cid) {
    try {
      if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
        return "El carrito no existe";
      }

      const cart = await cartModel.findOne({ id: cid });
      return cart;
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }
  async addProductToCart(cid, pid) {
    try {
      if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
        return "El carrito no existe";
      }
      if ((await productModel.findOne({ id: pid }).countDocuments({})) == 0) {
        return "El producto que desea agregar no existe";
      }
      const cartSelected = await cartModel.findOne({ id: cid });
      const objetoProducto = cartSelected.products.find((p) => p.id == pid);
      const indexObjetoProduct = cartSelected.products.indexOf(objetoProducto);
      if (indexObjetoProduct < 0) {
        cartSelected.products.push({
          id: pid,
          quantity: 1,
        });
        await cartSelected.save();
        return `Se agregó el primer producto de ID: ${pid}  al carrito de ID ${cid}`;
      }
      objetoProducto.quantity += 1;
      //   cartSelected.products[indexObjetoProduct].quantity += 1;

      cartSelected.products[indexObjetoProduct] = objetoProducto;
      await cartModel.findOneAndUpdate({ id: cid }, { cartSelected });
      await cartSelected.save();
      return `Se agregó otro producto de ID: ${pid}  al carrito de ID ${cid}`;
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }
}

export default MongoCartManager;
