import { usersService } from "../services/users.service.js";
import { generateEmailToken, recoveryEmail } from "../helpers/gmail.js";
import {validateToken, createHash} from "../utils.js";
export class SessionsController{

    static redirectLogin = (req,res)=>{
        res.redirect("/profile");
    }
    static signup = (req,res)=>{
        res.render("login",{message:"usuario registrado"});
    }
    static failSignup = (req,res)=>{
        res.render("signup",{error:"No se pudo registrar el usuario"});
    }
    static failLogin = (req,res)=>{
        res.render("login",{error:"Credenciales invalidas"});
    }
    static changePassword = async(req,res)=>{
        try {
            const form = req.body;
            const user = await usersService.getByEmail(form.email);
            if(!user){
                return res.render("changePassword",{error:"No es posible cambiar la contraseña"});
            }
            user.password = createHash(form.newPassword);
            console.log(user);
            await usersService.update(user._id,user);
            return res.render("login",{message:"Contraseña restaurada"})
        } catch (error) {
            res.render("changePassword",{error:error.message});
        }
    }
    static loginGitHub = (req,res)=>{
        res.redirect("/profile");
    }
    static logout = (req,res)=>{
        req.logOut(error=>{
            if(error){
                return res.render("profile",{user: req.user, error:"No se pudo cerrar la sesion"});
            } else {
                //borra la sesion
                req.session.destroy(error=>{
                    if(error) return res.render("profile",{user: req.session.userInfo, error:"No se pudo cerrar la sesion"});
                    res.redirect("/");
                })
            }
        })
    }
    static forgotPassword = async(req,res)=>{
        try {
            const {email} = req.body;
            const user = await UsersService.getUserByEmail(email);
            if(!user){
                return res.json({status:"error", message:"No es posible restablecer la constraseña"});
            }
            //genera el token
            const token = generateEmailToken(email,3*60); //token de 3 min.
            //Enviar enlace al usuario
            await recoveryEmail(req,email,token);
            res.send("Correo enviado, volver");
        } catch (error) {
            res.json({status:"error", message:"No es posible restablecer la constraseña"});
        }
    };

    static resetPassword = async(req,res)=>{
        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            const validEmail = validateToken(token);
            if(validEmail){//token correcto
                const user = await UsersService.getUserByEmail(validEmail);
                if(user){
                    user.password = createHash(newPassword);
                    await usersService.updateUser(user._id,user);
                    res.send("Contraseña actualizada <a href='/login'>Ir al login</a>")
                }
            } else {
                return res.send("El token se venció <a href='/forgot-password'>Restablecer contraseña</a>");
            }
        } catch (error) {
            res.send("No se pudo restablecer la contraseña, volver a intentarlo <a href='/forgot-password'>Restablecer contraseña</a>");
        }
    };
}