import userModel from "../../models/users.model.js";
import bcrytFunctions from "../../utils/hashBcrypt.js";
import generateTokenFunction from "../../utils/jsonwebtoken.js";

const { isValidPassword } = bcrytFunctions;
const { generateToken } = generateTokenFunction;
//Creación de clase UserManager
class MongoUserManager {
  constructor() {}

  //Método para traer todos los usuarios
  async getUsers() {
    try {
      const result = await userModel.find({});
      return result;
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }

  //Método para traer solo un usuario
  async getUserBy(_id) {
    try {
      const result = await userModel.findOne({ _id: _id });
      if (result) {
        const date = new Date();
        const DD = result.birthdate.getDate();
        const MM = result.birthdate.getMonth() + 1;
        const YYYY = result.birthdate.getFullYear();
        const birthdate = DD + "/" + MM + "/" + YYYY;
        const edad = date.getFullYear() - YYYY;

        const resultFiltered = {
          first_name: result.first_name,
          last_name: result.last_name,
          birthdate: `${birthdate} (${edad} años)`,
          email: result.email,
          role: result.role,
          age: edad,
          id: result._id,
        };

        return {
          status: "OK",
          message: "Usuario validado",
          user: { resultFiltered },
        };
      }
      return { status: "ERROR", message: "Email y/o contraseña incorrectos" };
    } catch (error) {
      return { status: "ERROR", message: `Hubo un error: ${error}` };
    }
  }

  //Método agregar usuario
  async addUser(user) {
    try {
      //Validamos si es que el correo ya existe
      const existeEmail =
        (await userModel.find({ email: user.email }).countDocuments({})) != 0
          ? true
          : false;

      if (!existeEmail) {
        const result = await userModel.create(user);
        return {
          status: "OK",
          message: { result },
        };
      } else {
        return {
          status: "ERROR",
          message: `El correo ${user.email} ya existe.`,
        };
      }
    } catch (error) {
      return {
        status: "ERROR",
        message: `Hubo un error: ${error}`,
      };
    }
  }

  //Método para traer solo un usuario
  async authenticate(filter) {
    try {
      const nuevaPassword = filter.password;

      const result = await userModel.findOne({ email: filter.email });

      if (isValidPassword(nuevaPassword, result.password)) {
        const resultFiltered = {
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          birthdate: result.birthdate,
          role: result.role,
          userID: result._id,
        };

        const token = generateToken({
          fullname: `${result.first_name} ${result.last_name}`,
          id: result._id,
        });

        return {
          status: "OK",
          message: "Usuario validado",
          user: { resultFiltered },
          token: token,
        };
      }
      return { status: "ERROR", message: "Email y/o contraseña incorrectos" };
    } catch (error) {
      return { status: "ERROR", message: `Hubo un error: ${error}` };
    }
  }
}

export default MongoUserManager;
