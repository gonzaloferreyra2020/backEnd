import passport from "passport";
import LocalStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { usersService } from "../dao/index.js";
import { config } from "./config.js";

export const initializePassport = ()=>{
    passport.use("signupStrategy", new LocalStrategy(
        {
            //user,pass
            usernameField:"email",
            passReqToCallback:true,
        },
        async (req, username, password, done)=>{
            try {
                const {first_name} = req.body;
                //preguntar si esta registrado
                const user = await usersService.getByEmail(username);
                if(user){
                    return done(null, false)
                }
                const newUser = {
                    first_name:first_name,
                    email: username,
                    password:createHash(password)
                }
                const userCreated = await usersService.save(newUser);
                return done(null,userCreated)//registrado
            } catch (error) {
                return done(error)
            }
        }
    ));

    //serial
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });

    passport.deserializeUser(async(id,done)=>{
        const user = await usersService.getById(id);
        done(null,user) 
    });
}