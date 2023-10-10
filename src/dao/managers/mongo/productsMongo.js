import { productsModel } from "../../models/products.model.js";

export class productMongo{
    constructor(){
        this.model = productsModel;
    };

    async get(){
        try {
            const products = await this.model.find().lean();
            return products;
        } catch (error) {
            throw error;
        }
    };

    async getWithPaginate(query, options){
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async getById(id){
        //devuelve el producto que cumple con el id recibido
        try {
            return await productsModel.findById(id)

        } catch (err) {
            return { error: err.message }
        }
    };

    async save(product){
        try {
            const productCreated = await this.model.create(product);
            return productCreated;
        } catch (error) {
            throw error;
        }
    };
};