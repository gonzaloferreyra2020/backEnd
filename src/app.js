import express from "express";

import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";

const port = 8080;
const app = express();

//middlewares para usar POST
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//mensaje por consola
app.listen(port,()=>console.log(`Server listening on port ${port}`));

//handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//websocket
const socketServer = new Server(httpsServer);
let messages = [];

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", async (socketConnected)=>{
    console.log(`Nuevo usuario conectado  ${socketConnected.id}`);
    //lista de productos
    const listProductRealTime = await ProductManager.getProducts;
    
    //enviando lista
    socketConnected.emit('listProductReal',listProductRealTime );
  
    //escuchando mensaje
    socketConnected.on('addProduct', async(product)=>{
        await ProductManager.addProduct(product);
    })
    //escuchando mensaje deleteProduct
    socketConnected.on('deleteProduct', async(id)=>{
        await ProductManager.deleteProduct(Number(id));
    })
});
