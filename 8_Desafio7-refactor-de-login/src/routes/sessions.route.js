import { Router } from "express";
const router = Router();
import MongoUserManager from "../dao/MongoDb/user_manager.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.js";
import auth from "../middleware/authentication.middleware.js";

//CREAR UN USUARIO
router.post("/register", async (req, res, next) => {
  const { password, password_retype } = req.body;
  if (password != password_retype) {
    return res
      .status(400)
      .send({ status: "ERROR", message: "Las contraseñas no coinciden" });
  }
  const user = new MongoUserManager();
  const result = await user.addUser(req.body);
  res.send(result);
});

//VALIDAR UN USUARIO
router.post("/login", async (req, res) => {
  const user = new MongoUserManager();
  const result = await user.authenticate(req.body);

  req.session.email = result.user.resultFiltered.email;
  req.session.first_name = result.user.resultFiltered.first_name;
  req.session.last_name = result.user.resultFiltered.last_name;
  req.session.birthdate = result.user.resultFiltered.birthdate;
  req.session.role = result.user.resultFiltered.role;
  req.session.userID = result.user.resultFiltered.userID;
  const cart = new MongoCartManager();
  const carrito = await cart.getCart({
    user: result.user.resultFiltered.userID,
  });
  if (carrito) {
    req.session.cart = carrito._id;
  }

  res.send(result);
});

//ELIMINAR LA SESIÓN

router.get("/logout", auth, (req, res) => {
  req.session.destroy((error) => {
    if (!error) return res.redirect("/login");
    if (error) return res.send(error);
  });
});

router.get("/current", auth, (req, res) => {
  res.send("datos sesibles");
});

router.get("/current", auth, (req, res) => {
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
