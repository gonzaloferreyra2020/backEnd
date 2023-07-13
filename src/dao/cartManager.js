import { __dirname } from "../utils.js";
import path from "path";
import fs from "fs";

export class CartManager{
    constructor(fileName){
        this.path = path.join(__dirname,`/files/${fileName}`);
    };

    fileExists(){
        return fs.existsSync(this.path);
    }

    async getAll(){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                return carts;
            } else {
                throw new Error("No es posible obtener los carritos");
            }
        } catch (error) {
            throw error;
        }
    };

    async save(){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                let newId = 1;
                    if(carts.length>0){
                        newId= carts[carts.length-1].id+1;
                    }
                const newCart = {
                    id:newId,
                    products:[]
                };
                carts.push(newCart);
                await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'));
                return newCart;
            } else {
                throw new Error("No es posible esta operacion");
            }
        } catch (error) {
            throw error;
        }
    };

     // Actualizo carrito
     async update(cid, updatedFields) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) return;
            Object.keys(updatedFields).forEach((key) => {
                cart[key] = updatedFields[key];
            });
            const data = JSON.stringify(this.carts, null, 4);
            await fs.promises.writeFile(this.path, data);
            console.log('Carrito actualizado:', cart);
            return 'Archivo de carrito guardado.';
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async getCartById(id) {
        try {
            if (this.fileExists()) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                this.carts = [];
                throw new Error('No se encontro el carrito')
            }
            let cart = this.carts.find((cart) => cart.id == id);
            if (!cart) {
                console.error('Carrito no encontrado');
                return;
            }
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}