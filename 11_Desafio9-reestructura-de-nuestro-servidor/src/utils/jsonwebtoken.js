import jwt from "jsonwebtoken";
import configFunctions from "../config/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const { configObject } = configFunctions;

// const private_key = configObject.jwt_secret_Key;
const private_key = process.env.JWT_PRIVATE_KEY;

//no guardar datos sensibles

const generateToken = (user) => {
  const token = jwt.sign(user, private_key, { expiresIn: "24h" });

  return token;
};

const authTokenMiddleware = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  const authHeader = "BEARER " + req.cookies.cookieToken;
  console.log(authHeader);
  if (!authHeader)
    return res
      .status(401)
      .redirect("/login")
      .send("No autorizado. No hay token");
  // {"Authorization": "BEARER dfsdofjweofwefsfsd.44r.fwef" }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, private_key, (err, decodeUser) => {
    if (err)
      return res
        .status(401)
        .redirect("/login")
        .send("No autorizado. Token incorrecto");
    req.user = decodeUser;
    next();
  });
};

export default { generateToken, authTokenMiddleware };
