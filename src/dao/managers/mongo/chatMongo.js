import chatModel from "../models/chat.model.js"

export default class chatManager {
  getMessages = async () => {
    try {
      return await chatModel.find().lean().exec();
    } catch (error) {
      return error;
    }
  }

  createMessage = async (message) => {
    if (message.user.trim() === '' || message.message.trim() === '') {
      // Evitar crear mensajes vacíos
      return null;
    }

    try {
      return await chatModel.create(message);
    } catch (error) {
      return error;
    }
  }


  deleteAllMessages = async () => {
    try {
      console.log("Borrando todos los mensajes...");
      const result = await chatModel.deleteMany({});
      console.log("Mensajes borrados:", result);
      return result;
    } catch (error) {
      console.error("Error al borrar los mensajes:", error);
      return error;
    }
  }

}