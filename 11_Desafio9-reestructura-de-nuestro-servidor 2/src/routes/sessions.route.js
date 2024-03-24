import { Router } from "express";
const router = Router();
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
import UsersController from "../controllers/users.controller.js";
import sessionsController from "../controllers/sessions.controller.js";

const { authTokenMiddleware } = jsonwebtokenFunctions;
const { login, logout, current } = new sessionsController();
const { createUser } = new UsersController();

//CREAR UN USUARIO
router.post("/register", createUser);

//VALIDAR UN USUARIO -> LOGIN
router.post("/login", login);

//ELIMINAR LA SESIÓN
router.get("/logout", authTokenMiddleware, logout);

//VALIDAR SESIÓN
router.get("/current", authTokenMiddleware, current);

export default router;
