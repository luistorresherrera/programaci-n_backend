import { Router } from "express";
const router = Router();
import MongoUserManager from "../dao/MongoDb/user_manager.js";

//RENDERIZAR LOGIN
router.get("/", async (req, res) => {
  const { register } = req.query;

  res.render("login", { register });
});

export default router;
