import express from "express";
import {engine} from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import {Server} from "socket.io";
import { viewsRouter } from "./routes/views.routes.js";
import { ProductManager } from "./dao/productManager.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { config } from "./config/config.js";

const port = config.server.port;
const app = express();

//servidor https en una variable
const httpServer = app.listen(port,()=>console.log(`Servidor ok en el port ${port}`));

//middlewares para usar POST
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

//handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

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
    const listProduct = await ProductManager.getProducts;
    
    // enviando lista de productos
    socketConnected.emit('listProductReal',listProduct );

    // escuchando mensaje del addProduct
    socketConnected.on('addProduct', async(product)=>{
        await ProductManager.addProduct(product);
    })

    // escuchando mensaje del deleteProduct
    socketConnected.on('deleteProduct', async(id)=>{
        await ProductManager.deleteProduct(Number(id));
    })
});