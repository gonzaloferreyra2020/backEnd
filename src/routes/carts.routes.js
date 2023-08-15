import { Router } from "express"; 
import { CartManager } from "..//dao/cartManager.js";
import { ProductManager } from "..//dao/productManager.js";

const cartService = new CartManager("carts.json");
const productService = new ProductManager("products.json");

const router = Router();

router.post("/",async (req,res)=>{
    try {
        const cartCreated = await cartService.save();
        res.json({status:"success", data:cartCreated});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

// mostrar todos los carritos
router.get("/", async (req, res) => {
    try {
        let limit = Number(req.query.limit);
        if (!limit) {
            let result = await cartService.getAll();
            res.send(result);
        } else {
            let result = await cartService.getAll();
            res.send(result.slice(0, limit));
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});
//
router.get("/:cid", async (req,res)=>{
    try {
        const cid = req.params.cid;
        const result = await cartService.getCartById(cid);
        res.send(result);
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.post("/:cid/product/:pid",async (req,res)=>{
    try {
        const cartId  = req.params.cid;
        const productId  = req.params.pid;
        const cart = await cartService.getCartById(cartId );
        const product = await productService.getProductById(productId );
        const products = cart.products;
        const inCart = cart.products.find((p) => p.id == pid)
        if (inCart) {
            let index = products.findIndex((p) => p.id == pid);
            cart.products[ index ].quantity++;
            cartService.saveCart();
            res.json({ status: 'success', data: cart });
        } else {
            const newProd = {
                id: pid,
                quantity: 1
            }
            cart.products.push(newProd);
            cartService.saveCart()
            res.json({ status: 'success', data: cart });
        }
    } catch (error) {
        console.error(error.message);
        res.json({ status: "error", message: error.message });
    }
});

export {router as cartsRouter}