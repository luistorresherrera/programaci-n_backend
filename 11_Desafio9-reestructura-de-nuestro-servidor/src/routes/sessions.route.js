import { Router } from "express";
const router = Router();
import MongoUserManager from "../dao/MongoDb/user_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import auth from "../middleware/authentication.middleware.js";
import bcrytFunctions from "../utils/hashBcrypt.js";
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
import passport from "passport";
const { generateToken, authTokenMiddleware } = jsonwebtokenFunctions;
const { createHash } = bcrytFunctions;

//CREAR UN USUARIO
router.post("/register", async (req, res) => {
  const { password, password_retype, first_name, last_name, email, birthdate } =
    req.body;
  if (password != password_retype) {
    return res
      .status(400)
      .send({ status: "ERROR", message: "Las contraseñas no coinciden" });
  }

  const cartManager = new MongoCartManager();

  const newCart = await cartManager.createCart();

  const newUser = {
    first_name,
    last_name,
    email,
    birthdate,
    password: createHash(password),
    cart: newCart._id,
  };

  const user = new MongoUserManager();
  const result = await user.addUser(newUser);
  if (result.status == "ERROR") {
    return res.send(result);
  }

  const token = generateToken({
    fullname: `${first_name} ${last_name}`,
    id: result.message.result._id,
  });
  result.token = token;

  res.send(result);
});

//REGISTER CON PASSPORT
// router.post(
//   "/register",
//   passport.authenticate("register", {
//     failureRedirect: "/api/sessions/failregister",
//   }),
//   async (req, res) => {
//     const cart = new MongoCartManager();
//     const result = await cart.createCart(req.user._id);
//     req.session.cart = result._id;
//     res.send({ status: "OK" });
//   }
// );

// router.get("failregister", (req, res) => {
//   res.send({ error: "failregister" });
// });

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

//LOGIN CON PASSPORT
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "ERROR", message: "No autorizado" });
    const cart = new MongoCartManager();
    const cartResult = await cart.getCart({ user: req.user._id });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      birthdate: req.user.birthdate,
      role: req.user.role,
      userID: req.user._id,
      cart: cartResult._id,
    };
    console.log(req.session);
    res.send({ status: "OK" });
  }
);

//VALIDAR UN USUARIO -> LOGIN
// router.post("/login", async (req, res) => {
//   const user = new MongoUserManager();

//   const result = await user.authenticate(req.body);

//   if (result.status == "OK") {
//     req.session.email = result.user.resultFiltered.email;
//     req.session.first_name = result.user.resultFiltered.first_name;
//     req.session.last_name = result.user.resultFiltered.last_name;
//     req.session.birthdate = result.user.resultFiltered.birthdate;
//     req.session.role = result.user.resultFiltered.role;
//     req.session.userID = result.user.resultFiltered.userID;
//     req.session.auth = true;

//     const cart = new MongoCartManager();
//     const carrito = await cart.getCart({
//       user: result.user.resultFiltered.userID,
//     });
//     if (carrito) {
//       req.session.cart = carrito._id;
//     }
//   }
//   console.log(result);
//   res.send(result);
// });

//ELIMINAR LA SESIÓN

router.get("/logout", auth, (req, res) => {
  req.session.destroy((error) => {
    if (!error) return res.redirect("/login");
    if (error) return res.send(error);
  });
});

router.get("/current", authTokenMiddleware, (req, res) => {
  res.send("datos sesibles");
});

// // //TRAER UN USER POR ID
// router.get("/users/:uid", async (req, res) => {
//   const { uid } = req.params;
//   const user = new MongoUserManager();

//   return res.status(200).send(await user.getUserBy({ _id: uid }));
// });

// // //TRAER TODOS LOS USERS EXISTENTES
// router.get("/users", async (req, res) => {
//   const user = new MongoUserManager();
//   const result = await user.getUsers();

//   return res.status(200).send(result);
// });

export default router;
