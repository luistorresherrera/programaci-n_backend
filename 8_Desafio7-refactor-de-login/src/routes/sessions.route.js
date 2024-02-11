import { Router } from "express";
const router = Router();
import MongoUserManager from "../dao/MongoDb/user_manager.js";

// //TRAER UN USER POR ID
router.get("/users/:uid", async (req, res) => {
  const { uid } = req.params;
  const user = new MongoUserManager();

  return res.status(200).send(await user.getUserBy({ _id: uid }));
});

// //TRAER TODOS LOS USERS EXISTENTES
router.get("/users", async (req, res) => {
  const user = new MongoUserManager();
  const result = await user.getUsers();

  return res.status(200).send(result);
});

//CREAR UN USUARIO
router.post("/register", async (req, res, next) => {
  const user = new MongoUserManager();
  const result = await user.addUser(req.body);
  res.redirect("/login");
});

export default router;
