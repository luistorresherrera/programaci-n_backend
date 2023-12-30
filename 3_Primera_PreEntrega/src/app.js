import express from "express";
import productsRourter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
const app = express();
const fileData = "./data/products.json";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//USAR MIDDLEWARE PARA ROUTER DE PRODUCTOS
app.use("/api/products", productsRourter);

//USAR MIDDLEWARE PARA ROUTER DE CARTS
app.use("/api/carts", cartsRouter);

//ACTIVAR LA ESCUCHA DEL SERVIDOR EN EL PUERTO XXXX
app.listen(8080, () => {
  console.log("Hola, estoy escuchando en el puerto 8080");
});
