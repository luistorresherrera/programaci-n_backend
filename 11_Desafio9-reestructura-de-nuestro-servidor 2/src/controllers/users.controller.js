import MongoUserManager from "../dao/MongoDb/user_manager.mongo.js";
import MongoCartManager from "../dao/MongoDb/cart_manager.mongo.js";
import bcrytFunctions from "../utils/hashBcrypt.js";
import jsonwebtokenFunctions from "../utils/jsonwebtoken.js";
const { generateToken } = jsonwebtokenFunctions;
const { createHash } = bcrytFunctions;

class UsersController {
  constructor() {
    // this.userService = new MongoUserManager();
    // this.cartService = new MongoCartManager();
  }

  //TRAER USUARIOS
  async getUsers(req, res) {}

  // TRAER UN USUARIO
  async getUser(req, res) {}

  // CREAR UN USUARIO
  async createUser(req, res) {
    const {
      password,
      password_retype,
      first_name,
      last_name,
      email,
      birthdate,
    } = req.body;
    if (password != password_retype) {
      return res
        .status(400)
        .send({ status: "ERROR", message: "Las contraseñas no coinciden" });
    }
    const cartService = new MongoCartManager();
    let newCart = await cartService.createCart();

    const newUser = {
      first_name,
      last_name,
      email,
      birthdate,
      password: createHash(password),
      cart: newCart._id,
    };

    const userService = new MongoUserManager();
    const result = await userService.addUser(newUser);
    if (result.status == "ERROR") {
      return res.send(result);
    }

    const token = generateToken({
      first_name: result.message.result.first_name,
      last_name: result.message.result.last_name,
      id: result.message.result._id,
      email: result.message.result.email,
      birthdate: result.message.result.birthdate,
      cart: result.message.result.cart,
      role: result.message.result.role,
    });
    result.token = token;

    res.send(result);
    try {
    } catch (error) {
      console.log(error);
    }
  }
  //ACTUALIZAR DATOS DE UN USUARIO
  async updateUser(req, res) {}

  //ELIMINAR UN USUARIO
  async deleteUser(req, res) {}

  //GET ACCOUNT
  accountInfo(req, res) {
    const birthdateCookie = req.user.birthdate;

    const date = new Date();
    const DD = birthdateCookie.substr(8, 2);
    const MM = birthdateCookie.substr(5, 2);
    const YYYY = birthdateCookie.substr(0, 4);
    const birthdate = DD + "/" + MM + "/" + YYYY;
    const edad = date.getFullYear() - Number(YYYY);

    const result = {
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      birthdate: `${birthdate} (${edad} años)`,
      role: req.user.role,
    };

    res.render("account", result);
  }
}

export default UsersController;
