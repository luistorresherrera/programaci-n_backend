import MongoUserManager from "../dao/MongoDb/user_manager.js";

class sessionsController {
  constructor() {}

  async login(req, res) {
    try {
      const user = new MongoUserManager();
      const result = await user.authenticate(req.body);
      res.cookie("cookieToken", result.token).send(result);
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("cookieToken").redirect("/login");
    } catch (error) {
      console.log(error);
    }
  }

  async current(req, res) {
    try {
      res.send("datos sesibles");
    } catch (error) {
      console.log(error);
    }
  }
}
export default sessionsController;
