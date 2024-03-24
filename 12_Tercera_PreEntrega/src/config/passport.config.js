import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.model.js";
import MongoUserManager from "../dao/MongoDb/user_manager.mongo.js";
import bcrytFunctions from "../utils/hashBcrypt.js";
import GithubStrategy from "passport-github2";
import dotenv from "dotenv";

const { createHash, isValidPassword } = bcrytFunctions;
const localStrategy = local.Strategy;
dotenv.config();
const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, birthdate } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            birthdate,
          };

          const userObj = new MongoUserManager();
          const result = await userObj.addUser(newUser);
          console.log(result);
          return done(null, result.message.result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            console.log("User not found");

            return done(null, false);
          }

          if (!isValidPassword(password, user.password)) {
            return done(null, false);
          }
          console.log("Usuario encontrado");
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.5982bf4f00fabec6",
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          let user = await userModel.findOne({
            email: profile._json.email,
          });

          if (user) {
            return done(null, user);
          }

          const newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            role: "user",

            password: "",
            birthdate: "1993-09-22T00:00:00.000+00:00",
          };
          console.log("Esto es una prueba");
          console.log(newUser);
          const userObj = new MongoUserManager();
          const result = await userObj.addUser(newUser);
          console.log(result);
          return done(null, result.message.result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    const user = await userModel.findById({ _id: _id });
    done(null, user);
  });
};

export default initializePassport;
