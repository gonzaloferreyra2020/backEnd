import { productMongo } from "./managers/mongo/productsMongo.js";
import { CartManager } from "./managers/mongo/cartMongo.js";
import { connectDB } from "../config/dbConection.js";
import { UsersMongo } from "./managers/mongo/usersMongo.js";

//persistencia de archivos
// const productService = new ProductManager(config.fileSystem.productsFile);
// const cartService = new CartManager(config.fileSystem.cartFile);

//persistencia de mongoDB
connectDB();
const productService = new productMongo();
const cartService = new CartManager();
const usersService = new UsersMongo();

export {productService, cartService, usersService}