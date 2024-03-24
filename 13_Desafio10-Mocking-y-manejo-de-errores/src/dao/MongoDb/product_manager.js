//---->CÓDIGO DEL EJERCICIO<------

//importo FS
import { promises } from "fs";
import productModel from "../../models/products.model.js";
const fs = promises;
// const fs = require("fs").promises;

//Creación de clase ProductManager
class MongoProductManager {
  constructor() {}

  //Método para traer todos los productos
  async getProducts() {
    try {
      const result = await productModel.find({});
      return result;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para traer solo un producto a través de su ID
  async getProduct(id) {
    try {
      const result = await productModel.findOne({ _id: id });
      return result;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método agregar producto
  async addProduct(product) {
    try {
      //Validamos si es que el código de producto ya existe
      const existeCodigo =
        (await productModel.find({ code: product.code }).countDocuments({})) !=
        0
          ? true
          : false;

      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock
      ) {
        return console.log(
          "Por favor completar los campos del producto a agregar."
        );
      }
      // Si el código de producto no existe
      if (existeCodigo == false) {
        // y si es el primer producto dentro del array encontrado, entonces registrar con ID 1
        if (productModel.countDocuments({}) == 0) {
          await productModel.create({ ...product, id: 1 });

          return console.log("Se agregó el producto correctamente.");
        } else {
          // Si el array traido del archivo tiene uno o más productos, entonces agreguemos el producto encontrado

          await productModel.create({
            ...product,
            id: await productModel.countDocuments({}),
          });

          return "Se agregó el producto correctamente.";
        }
      } else {
        return console.log(
          "No se puede crear el producto porque ya existe el código."
        );
      }
    } catch (error) {
      console.log("Hemos encontrado un error: ", error);
    }
  }

  //Método para actualizar un producto dentro del archivo modificando todo el objeto
  async updateCompleteProduct(id, modifierObject) {
    try {
      const result =
        (await productModel.findOne({ id: id }).countDocuments({})) == 0
          ? `No se encontro el producto con ID: ${id}`
          : await productModel.findOneAndUpdate({ _id: id }, modifierObject, {
              new: true,
            });
      return { status: "success", result: result };
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para borrado lógico de un producto
  async deleteProduct(id) {
    try {
      const productoToDelete = await productModel.findOne({ id: id });
      if (productoToDelete.status == 1) {
        await productModel.updateOne({ _id: id }, { status: 0 });

        return `Se eliminó el producto con ID: ${id}`;
      }
      return `El producto con ID: ${id}, se encuentra eliminado.`;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para activado lógico de un producto
  async activateProduct(id) {
    try {
      const productoToActivate = await productModel.findOne({ id: id });
      if (productoToActivate.status == 0) {
        await productModel.updateOne({ _id: id }, { status: 1 });

        return `Se activó el producto con ID: ${id}`;
      }
      return `El producto con ID: ${id}, se encuentra activo`;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }
}

export default MongoProductManager;
