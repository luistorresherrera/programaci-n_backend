import { Router } from "express";

const router = Router();
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
import UsersController from "../controllers/users.controller.js";

const { authTokenMiddleware } = jsonwebtokenFunctions;

const { accountInfo } = new UsersController();
//RENDERIZAR ACCOUNT
router.get("/", authTokenMiddleware, accountInfo);

export default router;
