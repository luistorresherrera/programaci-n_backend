//---->CÓDIGO DEL EJERCICIO<------

//importo FS
import { promises } from "fs";
const fs = promises;
// const fs = require("fs").promises;

//Creación de clase CartManager
class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async grabarCartsEnArchivo(array) {
    try {
      await fs.writeFile(this.path, JSON.stringify(array, null, 2), "UTF-8");
    } catch (error) {
      console.log("Hubo un error: ", error);
    }
  }

  //Método crear cart
  async createCart() {
    try {
      //Traemos a un Array todos los carts que estan en el archivo
      const arrayCarts = await this.getCarts();

      // y si es el primer carrito dentro del array encontrado, entonces registrar con ID 1
      if (arrayCarts.length == 0) {
        arrayCarts.push({ id: 1, products: [] });
        await this.grabarCartsEnArchivo(arrayCarts);

        return "Se agregó el carrito correctamente.";
      } else {
        // Si el array traido del archivo tiene uno o más carts, entonces agreguemos el nuevo cart

        arrayCarts.push({
          id: arrayCarts[(await arrayCarts.length) - 1].id + 1,
          products: [],
        });

        await this.grabarCartsEnArchivo(arrayCarts);

        return "Se agregó el producto correctamente.";
      }
    } catch (error) {
      return "Hemos encontrado un error: ", error;
    }
  }

  //Método para obtener todos los carts

  async getCarts() {
    try {
      const cartsJSON = await fs.readFile(this.path, "utf-8");
      // validaremos si la respuesta del archivo existe o no.
      if (cartsJSON) {
        const cartsLeidosJS = JSON.parse(cartsJSON);
        // si existe retornamos el array
        return cartsLeidosJS;
      } else {
        // si no existe, retornamos un array vacío
        return [];
      }
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }

  // // Método para obtener un producto envando su ID como parámetro
  // async getProductsById(id) {
  //   try {
  //     const products = await this.getProducts();
  //     const productById =
  //       products.find((p) => p.id == id) ||
  //       "No existe el código del productos que desea buscar.";
  //     return productById;
  //   } catch (error) {
  //     console.log("Hemos encontrado un error: ", error);
  //   }
  // }

  // //Método para actualizar un producto dentro del archivo modificando solo un key y value
  // async updateProduct(id, keybuscado, nuevoValor) {
  //   try {
  //     //trae a un array los productos que estan en el archivo
  //     const productosActuales = await this.getProducts();
  //     //trae a un objeto el producto que ha sido seleccionado
  //     const productoSeleccionado = await this.getProductsById(id);
  //     //valida que el keybuscado para actualización realmente exista
  //     const mapKeys = Object.keys(productoSeleccionado);
  //     const existeKey = mapKeys.find((e) => e == keybuscado) ? true : false;
  //     //valida que el ID exista en los productos registrados en el archivo
  //     const existeId = productosActuales.find((e) => e.id == id) ? true : false;
  //     //consigue el index del objeto seleccionado a través del ID
  //     const index = productosActuales.findIndex((prod) => prod.id == id);
  //     //si es que existe el ID y también el key para cambiarle el value, entonces actualizar el valor y agregarlo al array de productos en memoria
  //     if (existeId && existeKey) {
  //       productosActuales[index][keybuscado] = nuevoValor;
  //       productosActuales.map((item) => {
  //         this.products.push(item);
  //       });
  //       // grabar el array de productos en el archivo
  //       this.grabarProductosEnArchivo(this.products);
  //     } else {
  //       console.log("No se pudo actualizar el producto");
  //     }
  //   } catch (error) {
  //     console.log(`Hubo un error: ${error}`);
  //   }
  // }

  // //Método para actualizar un producto dentro del archivo modificando todo el objeto
  // async updateCompleteProduct(id, modifierObject) {
  //   try {
  //     //trae a un array los productos que estan en el archivo
  //     const productosActuales = await this.getProducts();

  //     //consigue el index del objeto seleccionado a través del ID
  //     const index = productosActuales.findIndex((prod) => prod.id == id);
  //     const mapKeys = Object.keys(productosActuales[index]);
  //     let count = 0;
  //     mapKeys.map((item) => {
  //       if (modifierObject[item] && item != "id" && item != "status") {
  //         productosActuales[index][item] = modifierObject[item];
  //         count++;
  //       }
  //     });
  //     this.grabarProductosEnArchivo(productosActuales);
  //     return `Se modificaron ${count} campos del producto con ID: ${id}`;
  //   } catch (error) {
  //     return `Hubo un error: ${error}`;
  //   }
  // }

  // //Método para borrar un producto
  // async deleteProduct(id) {
  //   try {
  //     const products = await this.getProducts();
  //     const index = products.findIndex((prod) => prod.id == id);
  //     if (products[index].status == 1) {
  //       products[index].status = 0;
  //       this.grabarProductosEnArchivo(products);
  //       return `Se eliminó el producto con ID: ${id}`;
  //     }
  //     return `El producto con ID: ${id}, ya no existe.`;
  //   } catch (error) {
  //     return `Hubo un error: ${error}`;
  //   }
  // }
}

export default CartManager;
