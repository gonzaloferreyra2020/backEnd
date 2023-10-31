import { productsModel } from "../../models/products.model.js";

export class productMongo{
    categories = async () => {
        try {
            const categories = await productsModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])
            return categories[0].categories
        }
        catch (err) {
            console.log(err);
            return err
        }
    }

    async get(){
        try {
            const products = await productsModel.find().lean();
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
    
    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch (err) {
            return err
        }
    }

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product })
        } catch (err) {
            return err
        }
    }

    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err
        }
    }
};