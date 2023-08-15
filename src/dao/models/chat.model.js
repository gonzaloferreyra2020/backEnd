import mongoose, { Schema } from "mongoose";

const chatCollection = "chatMessages";

const messageSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

const chatModel = mongoose.model(chatCollection,messageSchema)

export default chatModel;