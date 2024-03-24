import MongoUserManager from "../dao/MongoDb/user_manager.js";

async function auth(req, res, next) {
  if (req.session.user) {
    // console.log("Hay sesión");
    return next();
  } else {
    res.render("login", {
      error: "Sesión cerrada",
    });
  }
}
export default auth;
