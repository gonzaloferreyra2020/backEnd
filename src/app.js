import express from "express";
import {engine} from "express-handlebars";
import { __dirname } from "./utils.js";
import {Server} from "socket.io";
import { viewsRouter } from "./routes/views.routes.js";
import { productsMongo } from "./dao/managers/mongo/productsMongo.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { config } from "./config/config.js";
import { connectDB } from "./config/dbConection.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";
import MongoStore from "connect-mongo";
import path from "path";
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';
import { chatModel } from "./dao/models/chat.model.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generateUser } from './utils/helpers.js'; 
import { addLogger } from "./helpers/logger.js";
import { usersRouter } from "./routes/users.routes.js";

const port = config.server.port;
const app = express();
const logger = addLogger();

//servidor https en una variable
const httpServer = app.listen(port, () => {
    try {
        logger.info("Server ok")
    }
    catch (err) {
        logger.info("Error", err)
    }
});

//conexion a base de datos
connectDB();

//middlewares para usar POST
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

//handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//configuracion de session
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

//config passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//websocket
const socketServer = new Server(httpServer);
let messages = [];

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/",viewsRouter);
app.use(errorHandler);

socketServer.on("connection",(socket)=>{
    console.log("nuevo cliente conectado");

    socket.on("authenticated",async(msg)=>{
        const messages = await chatModel.find();
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser", msg);
    });

    socket.on("message",async(data)=>{
        console.log("data", data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
    })
});

// Facker
app.get("/api/users", (req,res)=>{
    const cant = parseInt(req.query.cant) || 100;
    let users = [];
    for(let i=0;i<cant;i++){
        const user = generateUser();
        users.push(user);
    }
    res.json({status:"success", data:users});
});

// Logger
app.get("/operation",(req,res)=>{
    let sum=0;
    for(let i=0;i<1000;i++){
        sum+=i;
    }
    res.send(`La suma es igual a ${sum}`);
});