import express from "express";
import { ProductManager } from "./ProductManager.js";
const port = 8080;

//creamos la aplicacion del servidor
const app = express();

//levantar el servidor
app.listen(port,()=>console.log(`El servidor esta escuchando en el puerto ${port}`));

//crear objeto producto
const product = new ProductManager(`./products.js`);
let resultado = 0;

app.get("/products",(req,res)=>{
    try {
        const result = product.getProducts();
        console.log("result: ", result);
        const limite = parseInt(req.query.limit);
        console.log("limite: ", limite);
        if (limite>0) {
            resultado = result.filter(producto=>producto.id <= limite);
        } else {
            resultado = result;
        }
        res.send(resultado);
    } catch (error) {
        res.send(error.message);
    }
});

app.get("/products/:pid",(req,res)=>{
    try {
    const pid = parseInt(req.params.pid);
    const result = product.getProductById(pid);
        if (!result) {
            console.log("El producto no existe");
        } else {
            res.send(result);
        }
    } catch (error) {
        res.send(error.message);
    }
});
