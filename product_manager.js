//---->CÓDIGO DEL EJERCICIO<------

//importo FS
const fs = require("fs").promises;

//Creación de clase ProductManager
class ProductManager {
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
  addProduct(product) {
    let arrayProductosEnArchivo = [];

    //Traemos a un Array todos los productos que estan en el archivo
    this.getProducts()
      .then((p) => {
        p &&
          p.map((item) => {
            arrayProductosEnArchivo.push(item);
          });
      })
      .then(() => {
        //Validamos si es que el código de producto ya existe
        const existeCodigo = arrayProductosEnArchivo.find(
          (p) => p.code == product.code
        )
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
          if (arrayProductosEnArchivo.length == 0) {
            this.products.push({ ...product, id: 1 });
            this.grabarProductosEnArchivo(this.products);

            return console.log("Se agregó el producto correctamente.");
          } else {
            // Si el array traido del archivo tiene uno o más productos, entonces agreguemos el producto encontrado
            arrayProductosEnArchivo.map((item) => {
              this.products.push(item);
            });
            this.products.push({
              ...product,
              id: this.products[arrayProductosEnArchivo.length - 1].id + 1,
            });

            this.grabarProductosEnArchivo(this.products);

            return console.log("Se agregó el producto correctamente.");
          }
        } else {
          return console.log(
            "No se puede crear el producto porque ya existe el código."
          );
        }
      });
  }

  //Método para obtener todos los productos

  async getProducts() {
    try {
      const productosJSON = await fs.readFile(this.path, "utf-8");
      // validaremos si la respuesta del archivo existe o no.
      if (productosJSON) {
        const productosLeidosJS = JSON.parse(productosJSON);
        // si existe retornamos el array
        return productosLeidosJS;
      } else {
        // si no existe, retornamos un array vacío
        return [];
      }
    } catch (err) {
      console.log("Hubo un error: ", err);
      return false;
    }
  }

  // Método para obtener un producto envando su ID como parámetro
  async getProductsById(id) {
    const products = await this.getProducts();
    const productById =
      products.find((p) => p.id == id) ||
      "No existe el código del productos que desea buscar.";
    return productById;
  }

  //Método para actualizar un producto dentro del archivo
  async updateProduct(id, keybuscado, nuevoValor) {
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
  }

  //Método para borrar un producto
  async deleteProduct(id) {
    const products = await this.getProducts();
    const arrayYaEliminado = products.filter((item) => item.id !== id);
    this.grabarProductosEnArchivo(arrayYaEliminado);
  }
}

//---->CÓDIGO PARA PRUEBAS DE FUNCIONAMIENTO<------

let prod = new ProductManager("./data/products.json");

//Probar el método addProduct
// prod.addProduct({
//   title: "BMW 320i",
//   description: "vehículo",
//   price: 24000,
//   thumbnail: "url1",
//   code: "320i",
//   stock: 3,
// });

// prod.addProduct({
//   title: "BMW 316i",
//   description: "vehículo",
//   price: 18000,
//   thumbnail: "url2",
//   code: "316i",
//   stock: 5,
// });

prod.addProduct({
  title: "Audi S3",
  description: "vehículo",
  price: 32000,
  thumbnail: "url3",
  code: "AS3",
  stock: 10,
});

// //Probar el método getProductsById
// prod.getProductsById(2).then((e) => console.log(e));

//Probar el método updateProduct
// prod.updateProduct(3, "code", "AUS3");
// prod.updateProduct(3, "price", 52000);
// prod.updateProduct(3, "xxx", 52000);

//Probar el método getProducts
// prod.getProducts().then((p) => console.log(p));

//Probar método deleteProduct
// prod.deleteProduct(1);
