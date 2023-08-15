import { Router } from "express";

const router = Router();
//routes
router.get("/", (req,res)=>{
    res.render("home");
});

export {router as viewsRouter};