import { Router } from "express";
const router = Router();
import ProductManager from "../../src/product_manager.js";
const fileData = "./data/products.json";

//QUERY PARA TRAER PRODUCTOS CON LÍMITE DE ITEMS
router.get("/query", (req, res) => {
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
      const prod = new ProductManager(fileData);
      const productosAMostrar = [];
      const showProducts = async () => {
        const productosArchivados = await prod.getProducts();
        // si el límite es mayor a la longitud del array de objetos, entonces devuélveme la longitud del array como límite
        let limite =
          limit <= productosArchivados.length
            ? parseInt(limit) - 1
            : productosArchivados.length - 1;

        for (let i = 0; i <= limite; i++) {
          productosAMostrar.push(productosArchivados[i]);
        }
        return res.send(productosAMostrar);
      };
      showProducts();
    }
  } catch (error) {
    return res.send(error);
  }
});

//TRAER UN PRODUCTOS ESPECÍFICO POR EL ID DEL PRODUCTO
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const prod = new ProductManager(fileData);

  const showProduct = async () => {
    res.send(await prod.getProductsById(pid));
  };

  showProduct();
});

//TRAER TODOS LOS PRODUCTOS POR PARAMETRO DE URL
router.get("/", (req, res) => {
  const prod = new ProductManager(fileData);
  const showProducts = async () => {
    res.send(await prod.getProducts());
  };

  showProducts();
});

//TRAER TODOS LOS PRODUCTOS UTILIZANDO LOS PARAMETROS DE LA URL
router.post("/add", (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.query;
  if (!title || !description || !price || !code || !stock) {
    return res.send(
      "Debes colocar los campos title, description, price, thumbnail (opcional), code y stock para poder agregar el producto"
    );
  }
  const prod = new ProductManager(fileData);
  const productObject = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status: 1,
  };

  const addProduct = async () => {
    res.send(await prod.addProduct(productObject));
  };

  addProduct();
});

//ACTUALIZAR UN PRODUCTO DESDE EL ID MODIFICANDO SUS CAMPOS QUE VIENEN EN BODY
router.put("/modify/:pid", (req, res) => {
  const { pid } = req.params;
  const modifierObject = req.body;
  const prod = new ProductManager(fileData);
  const modifyProduct = async () => {
    res.send(await prod.updateCompleteProduct(pid, modifierObject));
  };

  modifyProduct();
});

//ELIMINAR PRODUCTO DEL CARRITO, ÚNICAMENTE CAMBIARÁ EL STATUS DE TRUE (1) A FALSE (0)
router.delete("/delete/:pid", (req, res) => {
  const { pid } = req.params;
  const prod = new ProductManager(fileData);
  const deleteProduct = async () => {
    res.send(await prod.deleteProduct(pid));
  };

  deleteProduct();
});

export default router;
