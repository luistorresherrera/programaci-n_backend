import jwt from "jsonwebtoken";

//no guardar datos sensibles
const private_key =
  "EstaDeberíaSerAlgunaPalabraSecretaQueDeberíaEstarEnVariablesDeEntorno";
const generateToken = (user) => {
  const token = jwt.sign(user, private_key);
  return token;
};

const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
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
