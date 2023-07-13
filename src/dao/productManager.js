import {__dirname} from "../utils.js";
import path from "path";
import fs from "fs";


export class ProductManager{
    constructor(fileName){
        this.path=path.join(__dirname,`/files/${fileName}`); //src/files/products.json
    };

    fileExists(){
        return fs.existsSync(this.path);
    }

    async get(){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                return products;
            } else {
                throw new Error("No es posible obtener los productos");
            }
        } catch (error) {
            throw error;
        }
    };

    async getById(id){
        //devuelve el producto que cumple con el id recibido
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.error('no hay producto con el ID seleccionado');
            return;
        }
        return product;
    };

    async save(product){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                let newId = 1;
                    if(products.length>0){
                        newId= products[products.length-1].id+1;
                    }
                const newProduct = {
                    id:newId,
                    ...product
                };
                products.push(newProduct);
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'));
                return newProduct;
            } else {
                throw new Error("No es posible guardar este producto");
            }
        } catch (error) {
            throw error;
        }
    };
}

