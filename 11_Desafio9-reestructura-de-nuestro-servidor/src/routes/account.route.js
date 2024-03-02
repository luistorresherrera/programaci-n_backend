import { Router } from "express";
import MongoUserManager from "../dao/MongoDb/user_manager.js";
import auth from "../middleware/authentication.middleware.js";
const router = Router();

//RENDERIZAR ACCOUNT
router.get("/", auth, async (req, res) => {
  const birthdateCookie = req.session.user.birthdate;

  const date = new Date();
  const DD = birthdateCookie.substr(8, 2);
  const MM = birthdateCookie.substr(5, 2);
  const YYYY = birthdateCookie.substr(0, 4);
  const birthdate = DD + "/" + MM + "/" + YYYY;
  const edad = date.getFullYear() - Number(YYYY);

  const result = {
    email: req.session.user.email,
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
    birthdate: `${birthdate} (${edad} años)`,
    role: req.session.user.role,
  };

  return res.render("account", result);
});

export default router;
