//---->CÓDIGO DEL EJERCICIO<------

import cartModel from "../../models/carts.model.js";
import productModel from "../../models/products.model.js";

//Creación de clase CartManager
class MongoCartManager {
  constructor() {}

  //Método crear cart
  async createCart(userId) {
    try {
      const cartCreated = cartModel.create({
        products: [],
        user: userId,
      });

      return cartCreated;
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
  async getCart(filter) {
    try {
      if ((await cartModel.findOne(filter).countDocuments({})) == 0) {
        return "El carrito no existe";
      }

      const cart = await cartModel.findOne(filter).lean();
      return cart;
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }
  async addProductToCart(cid, p_id) {
    try {
      if ((await cartModel.findOne({ _id: cid }).countDocuments({})) == 0) {
        return "El carrito no existe";
      }
      if (!(await productModel.findOne({ _id: p_id }))) {
        return "El producto que desea agregar no existe";
      }
      const productSelected = await productModel.findOne({ _id: p_id });

      const cartSelected = await cartModel.findOne({ _id: cid });
      // console.log("cid: " + cid);
      // console.log("pid: " + p_id);
      const objetoProducto = cartSelected.products.find(
        (p) => p.product._id == p_id
      );
      const indexObjetoProduct = cartSelected.products.indexOf(objetoProducto);

      if (indexObjetoProduct < 0) {
        cartSelected.products.push({
          product: productSelected._id,

          quantity: 1,
        });

        await cartModel.findOneAndUpdate({ _id: cid }, { cartSelected });
        await cartSelected.save();
        return {
          status: "OK",
          message: `Se agregó el primer producto de ID: ${p_id}  al carrito de ID ${cid}`,
        };
      }

      cartSelected.products[indexObjetoProduct].quantity += 1;

      await cartModel.findOneAndUpdate({ _id: cid }, { cartSelected });
      await cartSelected.save();

      return {
        status: "OK",
        message: `Se agregó otro producto de ID: ${p_id}  al carrito de ID ${cid}`,
      };
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }

  async deleteProductoFromCart(cid, p_id) {
    try {
      try {
        if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
          return "El carrito no existe";
        }
        if (
          (await productModel.findOne({ _id: p_id }).countDocuments({})) == 0
        ) {
          return "El producto que desea eliminar no existe en la base de datos";
        }
        if ((await cartModel.findOne({ id: cid }).countDocuments({})) != 0) {
          const cartSelected = await cartModel.findOne({ id: cid });
          if (!cartSelected.products.find((p) => p._id == p_id)) {
            return "El producto que desea eliminar no existe en el carrito";
          }
          const objetoProducto = cartSelected.products.find(
            (p) => p._id == p_id
          );
          const indexObjetoProduct =
            cartSelected.products.indexOf(objetoProducto);
          cartSelected.products.splice(indexObjetoProduct, 1);
          await cartSelected.save();
          return `Se elimino el producto de ID: ${p_id}  del carrito de ID ${cid}`;
        }
        await cartModel.findOne({ id: cid });
        return "Se elimino el carrito de ID: " + cid;
      } catch (err) {
        console.log("Hubo un error: ", err);
        return false;
      }
    } catch (error) {}
  }

  async updateProductsOnCart(cid, productsArray) {
    try {
      if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
        return "El carrito no existe";
      }
      const result = await cartModel.findOneAndUpdate(
        { id: cid },
        { products: productsArray },
        { new: true }
      );

      return result;
      // return `${p}+Se actualizo el carrito de ID: ${cid} con los productos enviados`;
    } catch (error) {
      console.log("Hubo un error: ", error);
      return false;
    }
  }

  async updateQuantityOfProductOnCart(cid, p_id, newQuantity) {
    try {
      if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
        return "El carrito no existe";
      }

      const cartSelected = await cartModel.findOne({ id: cid });
      if (!cartSelected.products.find((p) => p._id == p_id)) {
        return "El producto que busca no existe en el carrito";
      }

      const indexProducto = cartSelected.products.findIndex(
        (p) => p._id == p_id
      );
      cartSelected.products[indexProducto].quantity = newQuantity.quantity;
      await cartModel.findOneAndUpdate(
        { id: cid },
        { products: cartSelected.products }
      );

      return `Se actualizo la cantidad del producto de ID: ${p_id}  del carrito de ID ${cid}`;
    } catch (error) {
      console.log("Hubo un error: ", error);
      return false;
    }
  }

  async deleteAllProductsFromCart(cid) {
    try {
      try {
        if ((await cartModel.findOne({ id: cid }).countDocuments({})) == 0) {
          return "El carrito no existe";
        }

        await cartModel.findOneAndUpdate(
          { id: cid },
          { products: [] },
          { new: true }
        );

        return "Se eliminaron todos los productos del carrito de ID: " + cid;
      } catch (err) {
        console.log("Hubo un error: ", err);
        return false;
      }
    } catch (error) {}
  }
}

export default MongoCartManager;
