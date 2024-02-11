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
}

export default CartManager;
