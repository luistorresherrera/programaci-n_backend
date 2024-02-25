import express from "express";
import productsRourter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cookieParser from "cookie-parser";
import { Server as serverIO } from "socket.io";
import MongoProductManager from "./dao/MongoDb/product_manager.js";
import messageRouter from "./routes/messages.route.js";
import productsViewRouter from "./routes/productsView.route.js";
import connectDB from "./config/connectDB.js";
import MongoMessageManager from "./dao/MongoDb/message_manager.js";
import cartsViewRouter from "./routes/cartsView.route.js";
import sessionsRouter from "./routes/sessions.route.js";
import loginRouter from "./routes/login.route.js";
import accountRouter from "./routes/account.route.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const port = 8080;

//conexión a MongoDB
connectDB();

//PARA PODER LEER EL BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser(`@$La08081989$@`));

//Guardar Sessions en FileStore
// const fileStore = FileStore(session);
// app.use(
//   session({
//     store: new fileStore({
//       path: "./sessions",
//       ttl: 60 * 60 * 24,
//     }),
//     retries: 0,
//     secret: `secretCoder`,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

//GUARDAR SESIONES EN MONGO

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://luistorresAdmin:La08081989$@codercluster.po3gvlq.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 24 * 60 * 60 * 1000,
    }),
    retries: 0,
    secret: `secretCoder`,
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//SETEAR MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//CREAR UNA SESSION

// app.get("/session", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`Has visitado esta pagina ${req.session.counter} veces`);
//   } else {
//     req.session.counter = 1;
//     res.send("Bienvenido a la página");
//   }
// });

//SETEAR COOKIES EN EL NAVEGADOR

// app.get("/setCookie", (req, res) => {
//   res
//     .cookie("CoderCookie", "esta es una cookie firmada", {
//       maxAge: 20000,
//       signed: true,
//     })
//     .send("seteando cookie");
// });

//RETORNAR COOKIES EN EL NAVEGADOR

// app.get("/getCookie", (req, res) => {
//   res.send(req.signedCookies);
// });

//DESTRUIR LA COOKIE

// app.get("/deleteCookie", (req, res) => {
//   res.clearCookie("CoderCookie").send("Se borraron las cookies");
// });

//RENDERIZAR LA PAGINA DE REAL TIME PRODUCTS
app.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

//MIDDLEWARE PARA LA PAGINA DE LOGIN
app.use("/login", loginRouter);

//MIDDLEWARE PARA LA PAGINA DE LOGIN
app.use("/account", accountRouter);

//RENDERIZAR LA PAGINA DE REGISTRO
app.get("/register", (req, res, next) => {
  res.render("register");
});

//RENDERIZAR LA PAGINA DE ACCOUNT
// app.get("/account", (req, res, next) => {
//   res.render("account");
// });

//RENDERIZAR LA PAGINA DE CHAT
app.get("/chat", (req, res) => {
  res.render("chat");
});

//MIDDLEWARE PARA SESSIONS
app.use("/api/sessions", sessionsRouter);

//RENDERIZAR LA PAGINA DE PRODCUTSO
app.use("/cart", cartsViewRouter);

//RENDERIZAR LA PAGINA DE CARTS
app.use("/products", productsViewRouter);

//USAR MIDDLEWARE PARA ROUTER DE PRODUCTOS
app.use("/api/chat", messageRouter);

//USAR MIDDLEWARE PARA ROUTER DE PRODUCTOS
app.use("/api/products", productsRourter);

//USAR MIDDLEWARE PARA ROUTER DE CARTS
app.use("/api/carts", cartsRouter);

//RENDERIZAR LA PAGINA PRINCIPAL (RAIZ DEL LOCALHOST) -> Para el ejercicio redireccionará a home
app.get("/", (req, res) => {
  res.render("login");
});

//RENDERIZAR LA PAGINA DE REAL TIME PRODUCTS
app.get("*", (req, res) => {
  res.render("404", { error: "Pagina no encontrada" });
});

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
