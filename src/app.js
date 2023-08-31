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

const port = config.server.port;
const app = express();

//servidor https en una variable
const httpServer = app.listen(port,()=>console.log(`Servidor ok en el port ${port}`));

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
app.use("/",viewsRouter);


socketServer.on("connection", async (socketConnected)=>{
    console.log(`Nuevo usuario conectado  ${socketConnected.id}`);
    // lista de productos para realtime
    const listProduct = await productsMongo.getProducts;
    
    // enviando lista de productos
    socketConnected.emit('listProductReal',listProduct );

    // escuchando mensaje del addProduct
    socketConnected.on('addProduct', async(product)=>{
        await productsMongo.addProduct(product);
    })

    // escuchando mensaje del deleteProduct
    socketConnected.on('deleteProduct', async(id)=>{
        await productsMongo.deleteProduct(Number(id));
    })
});