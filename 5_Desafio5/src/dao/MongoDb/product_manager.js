//---->CÓDIGO DEL EJERCICIO<------

//importo FS
import { promises } from "fs";
import productModel from "../../models/products.model.js";
const fs = promises;
// const fs = require("fs").promises;

//Creación de clase ProductManager
class MongoProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async grabarProductosEnArchivo(array) {
    try {
      await fs.writeFile(this.path, JSON.stringify(array, null, 2), "UTF-8");
    } catch (error) {
      console.log("Hubo un error: ", error);
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

  // Método para obtener un producto envando su ID como parámetro
  //Método para actualizar un producto dentro del archivo modificando solo un key y value
  async updateProduct(id, keybuscado, nuevoValor) {
    try {
      //trae a un array los productos que estan en el archivo
      const productosActuales = await this.getProducts();
      //trae a un objeto el producto que ha sido seleccionado
      const productoSeleccionado = await this.getProductsById(id);
      //valida que el keybuscado para actualización realmente exista
      const mapKeys = Object.keys(productoSeleccionado);
      const existeKey = mapKeys.find((e) => e == keybuscado) ? true : false;
      //valida que el ID exista en los productos registrados en el archivo
      const existeId = productosActuales.find((e) => e.id == id) ? true : false;
      //consigue el index del objeto seleccionado a través del ID
      const index = productosActuales.findIndex((prod) => prod.id == id);
      //si es que existe el ID y también el key para cambiarle el value, entonces actualizar el valor y agregarlo al array de productos en memoria
      if (existeId && existeKey) {
        productosActuales[index][keybuscado] = nuevoValor;
        productosActuales.map((item) => {
          this.products.push(item);
        });
        // grabar el array de productos en el archivo
        this.grabarProductosEnArchivo(this.products);
      } else {
        console.log("No se pudo actualizar el producto");
      }
    } catch (error) {
      console.log(`Hubo un error: ${error}`);
    }
  }

  //Método para actualizar un producto dentro del archivo modificando todo el objeto
  async updateCompleteProduct(id, modifierObject) {
    try {
      //trae a un array los productos que estan en el archivo
      const productosActuales = await this.getProducts();

      //consigue el index del objeto seleccionado a través del ID
      const index = productosActuales.findIndex(
        (prod) => prod.id == Number(id)
      );
      const mapKeys = Object.keys(productosActuales[index]);
      let count = 0;
      mapKeys.map((item) => {
        if (modifierObject[item] && item != "id" && item != "status") {
          productosActuales[index][item] = modifierObject[item];
          count++;
        }
      });
      this.grabarProductosEnArchivo(productosActuales);
      return `Se modificaron ${count} campos del producto con ID: ${id}`;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para borrado lógico de un producto
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((prod) => prod.id == Number(id));
      if (products[index].status == 1) {
        products[index].status = 0;
        this.grabarProductosEnArchivo(products);
        return `Se eliminó el producto con ID: ${id}`;
      }
      return `El producto con ID: ${id}, ya no existe.`;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para activado lógico de un producto
  async activateProduct(id) {
    try {
      const productoToActivate = await productModel.findOne({ id: id });
      if (productoToActivate.status == 0) {
        await productModel.updateOne({ id: id }, { status: 1 });

        return `Se activó el producto con ID: ${id}`;
      }
      return `El producto con ID: ${id}, se encuentra activo`;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }
}

export default MongoProductManager;
