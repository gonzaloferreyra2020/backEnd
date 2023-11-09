import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({

    products: {
        type: [
            {
                _id: {
                    type: mongoose.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});
cartSchema.pre('find', function (next) {
    this.populate('products._id');
    next();
});
export const cartModel = mongoose.model(cartsCollection, cartSchema);