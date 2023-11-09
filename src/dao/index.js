import { productMongo } from "./managers/mongo/productsMongo.js";
import { CartManager } from "./managers/mongo/cartMongo.js";
import { connectDB } from "../config/dbConection.js";
import { UsersMongo } from "./managers/mongo/usersMongo.js";
import { TicketsMongo } from "./managers/ticketsMongo.js"; 

//persistencia de archivos
// const productService = new ProductManager(config.fileSystem.productsFile);
// const cartService = new CartManager(config.fileSystem.cartFile);

//persistencia de mongoDB
connectDB();
export const productService = new productMongo();
export const cartService = new CartManager();
export const usersService = new UsersMongo();
export const ticketsDao = new TicketsMongo();
