import passport from "passport";
import passportJwt from "passport-jwt";
import local from "passport-local";
import userModel from "../models/users.model.js";
import MongoUserManager from "../dao/MongoDb/user_manager.js";
import bcrytFunctions from "../utils/hashBcrypt.js";
import GithubStrategy from "passport-github2";

const { createHash, isValidPassword } = bcrytFunctions;
const localStrategy = local.Strategy;

const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["cookieToken"];
    }
    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:
          "EstaDeberíaSerAlgunaPalabraSecretaQueDeberíaEstarEnVariablesDeEntorno",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default initializePassport;
