import MongoUserManager from "../dao/MongoDb/user_manager.js";

async function auth(req, res, next) {
  const user = new MongoUserManager();
  const userData = await user.authenticate({ email: req.session.email });

  if (userData.status == "OK") {
    return next();
  } else {
    res.render("login", {
      error: "Sesión cerrada",
    });
  }
}
export default auth;
