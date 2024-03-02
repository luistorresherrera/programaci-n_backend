import jwt from "jsonwebtoken";
import configFunctions from "../config/connectDB.js";

const { configObject } = configFunctions;

const private_key = configObject.jwt_secret_Key;

//no guardar datos sensibles

const generateToken = (user) => {
  console.log(1);
  const token = jwt.sign(user, private_key);
  return token;
};

const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).send("No autorizado. No hay token");
  // {"Authorization": "BEARER dfsdofjweofwefsfsd.44r.fwef" }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, private_key, (err, decodeUser) => {
    if (err) return res.status(401).send("No autorizado. Token incorrecto");
    req.user = decodeUser;
    next();
  });
};

export default { generateToken, authTokenMiddleware };
