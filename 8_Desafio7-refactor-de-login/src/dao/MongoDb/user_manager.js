import userModel from "../../models/users.model.js";

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
  async getUserBy(filter) {
    try {
      const result = await userModel.findOne({ filter });
      return result;
    } catch (error) {
      return `Hubo un error: ${error}`;
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
        return result;
      } else {
        return `El correo ${user.email} ya existe.`;
      }
    } catch (error) {
      return `Hubo un error: ${error}`;
    }
  }
}

export default MongoUserManager;
