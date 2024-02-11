import express from "express";
import productsRourter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server as serverIO } from "socket.io";
import MongoProductManager from "./dao/MongoDb/product_manager.js";
import messageRouter from "./routes/messages.route.js";
import connectDB from "./config/connectDB.js";
import MongoMessageManager from "./dao/MongoDb/message_manager.js";

const app = express();
const port = 8080;

//conexión a MongoDB
connectDB();

//PARA PODER LEER EL BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

//SETEAR MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//RENDERIZAR LA PAGINA PRINCIPAL (RAIZ DEL LOCALHOST) -> Para el ejercicio redireccionará a home
app.get("/", (req, res) => {
  res.render("home");
});

//RENDERIZAR LA PAGINA DE REAL TIME PRODUCTS
app.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

//RENDERIZAR LA PAGINA DE CHAT
app.get("/chat", (req, res) => {
  res.render("chat");
});

//USAR MIDDLEWARE PARA ROUTER DE PRODUCTOS
app.use("/api/chat", messageRouter);

//USAR MIDDLEWARE PARA ROUTER DE PRODUCTOS
app.use("/api/products", productsRourter);

//USAR MIDDLEWARE PARA ROUTER DE CARTS
app.use("/api/carts", cartsRouter);

//ACTIVAR LA ESCUCHA DEL SERVIDOR HTTP EN EL PUERTO XXXX
const httpServer = app.listen(port, () => {
  console.log(`Hola, estoy escuchando en el puerto ${port}`);
});

//INICIANDO EL SERVIDOR SOCKET A PARTIR DEL SERVIDOR HTTP -> Configuración para usar socket del lado del servidor
const socketServer = new serverIO(httpServer);

socketServer.on("connection", (socket) => {
  // console.log("Un cliente se ha conectado");
  // socket.on("disconnect", () => {
  //   console.log("Un cliente se ha desconectado");
  // });

  socket.on("getProducts", async (data) => {
    const prod = new MongoProductManager();
    const products = await prod.getProducts();
    socket.emit("sendProducts", products);
  });

  socket.on("getMessages", async (data) => {
    const message = new MongoMessageManager();
    const result = await message.getMessages();
    socket.emit("receiveMessages", result);
  });
});

// socket.emit("message-server", "Hola cliente");
// socket.on("message", (data) => {
//   console.log(data);
// });

// socket.on("para-todos-menos-el-que-lo-mando", (data) => {
//   console.log(data);
// });

// socket.broadcast.emit(
//   "para-todos-menos-el-que-lo-mando",
//   "Hola a todos menos el que lo mandó"
// );
// socketServer.emit("para-todos", "Hola a todos");
