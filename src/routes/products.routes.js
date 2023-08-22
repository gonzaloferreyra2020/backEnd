import { Router } from "express"; 
import { ProductManager } from "../dao/managers/mongo/productsMongo.js";

import { engine } from 'express-handlebars';
import path from "path";
import {__dirname} from "../../src/utils.js";

//nueva instancia de ProductManager
const productService = new ProductManager(`products.json`);

//función para validar los campos
const validateFields = (req,res,next)=>{
    const productInfo = req.body;
    if (!productInfo.title || !productInfo.description || !productInfo.code || !productInfo.price || !productInfo.stock || !productInfo.category){
        return res.json({status:"error", message:"completar todos los campos"})
    }else{
        next();
    }
}
const router = Router();

//mostrar productos por limite
router.get("/", async (req,res)=>{
    try {
        const limit = req.query.limit;
        const products = await productService.get();
        let limitResult = 0;
        if(limit){
            //devolver productos de acuerdo al limite
            const limitProduct = parseInt(req.query.limit);
            if (limitProduct > 0) {
                limitResult = products.slice(0,limitProduct);
            } else {
                limitResult = products;
            }
            res.send(limitResult);
        } else {
            res.json({status:"success", data:products});
        }
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

//mostrar productos por ID
router.get("/:pid",async (req,res)=>{
    try {
        const pid = req.params.pid;
        const result = await productService.getProductById(pid);
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        
    }
});

//agregar productos
router.post("/", validateFields, async (req,res)=>{
    try {
        const productInfo = req.body;
        const productCreated = await productService.save(productInfo);
        res.json({status:"success", data:productCreated, message:"Se ha creado el producto"});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }

});

//actualizar productos
router.put("/:pid",validateFields,(req,res)=>{
    try {
        const pid = req.params.pid;
        const productInfo = req.body;
        const result =  productService.updateProduct(pid, productInfo);
        result.id = pid;
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        //throw new Error(error.message);
    }

});
router.delete("/:pid",(req,res)=>{});

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

export {router as productsRouter}