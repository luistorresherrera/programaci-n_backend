import { Router } from "express";
import MongoUserManager from "../dao/MongoDb/user_manager.js";
const router = Router();
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
import UsersController from "../controllers/users.controller.js";

const { authTokenMiddleware } = jsonwebtokenFunctions;

const { accountInfo } = new UsersController();
//RENDERIZAR ACCOUNT
router.get("/", authTokenMiddleware, accountInfo);

export default router;
