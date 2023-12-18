const express = require("express");
const ProductManager = require("./product_manager");
const app = express();

//QUERY PARA TRAER PRODUCTOS CON LÍMITE DE ITEMS
app.get("/products/query", (req, res) => {
  // traigo la variable limit del query de la URL
  const { limit } = req.query;

  try {
    //valido que los números menores de 1 me devuelvan un array vacío
    if (parseInt(limit) < 1) {
      console.log(
        "Cuando el límite solicitado es menor a 1, entonces el resultado siempre será vacío."
      );
      return res.send([]);
      // En caso de ser el limite 1 o más, entonces buscar la cantidad de productos
    } else {
      const prod = new ProductManager("./Desafio_3/data/products.json");
      const productosAMostrar = [];
      const mostrarProductos = async () => {
        const productosArchivados = await prod.getProducts();
        // si el límite es mayor a la longitud del array de objetos, entonces devuélveme la longitud del array como límite
        let limite =
          limit <= productosArchivados.length
            ? parseInt(limit) - 1
            : productosArchivados.length - 1;

        for (i = 0; i <= limite; i++) {
          productosAMostrar.push(productosArchivados[i]);
        }
        return res.send(productosAMostrar);
      };
      mostrarProductos();
    }
  } catch (error) {
    return res.send(error);
  }
});

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
app.get("/products", (req, res) => {
  const prod = new ProductManager("./Desafio_3/data/products.json");
  const mostrarProductos = async () => {
    res.send(await prod.getProducts());
  };

  mostrarProductos();
});

//TRAER UN PRODUCTOS ESPECÍFICO POR EL ID DEL PRODUCTO
app.get("/products/:pid", (req, res) => {
  const { pid } = req.params;
  const prod = new ProductManager("./Desafio_3/data/products.json");

  const mostrarProducto = async () => {
    res.send(await prod.getProductsById(pid));
  };

  mostrarProducto();
});

//ACTIVAR LA ESCUCHA DEL SERVIDOR EN EL PUERTO 8000
app.listen(8000, () => {
  console.log("Estoy escuchando en el puerto 8000");
});
