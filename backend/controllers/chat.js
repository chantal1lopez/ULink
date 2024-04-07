const { messageModel, chatModel, usersModel } = require("../models")


/**
 * Te crea un chat si no existe, sino te devuelve el existente
 */
const findOrCreateChat = async (req, res) => {
    const userId = req.user._id;
    const { participantId } = req.body;

    try {
        let chat = await chatModel.findOne({
            'sender.user_id': userId,
            'receiver.user_id': participantId
        });

        if (!chat) {
            chat = await chatModel.findOne({
                'sender.user_id': participantId,
                'receiver.user_id': userId
            });
        }

        if (chat) {
            return res.status(200).json({ chatId: chat._id, name: chat.receiver.name });
        }

        const otherUser = await usersModel.findById(participantId);
        if (!otherUser) {
            return res.status(404).json({ message: "El otro participante no existe" });
        }

        const userAsSender = new chatModel({
            sender: { user_id: userId, name: req.user.name, image: req.user.image },
            receiver: { user_id: participantId, name: otherUser.name, image: otherUser.image },
            unread_messages: 0
        });
        await userAsSender.save();

        const userAsReceiver = new chatModel({
            receiver: { user_id: userId, name: req.user.name, image: req.user.image },
            sender: { user_id: participantId, name: otherUser.name, image: otherUser.image },
            unread_messages: 0
        });
        await userAsReceiver.save();


        return res.status(201).json({ chatId: userAsSender._id, name: otherUser.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al buscar o crear el chat", error: error.message });
    }
};

/**
 * Te devuelve el listado de chats abiertos
 */
const getChats = async (req, res) => {
    const userId = req.user._id;

    try {
        const chats_array = await chatModel.find({ 'sender.user_id': userId });

        const chatDetails = await Promise.all(chats_array.map(async (chat) => {
            const chats = await chatModel.find({
                $or: [
                    { 'sender.user_id': chat.sender.user_id, 'receiver.user_id': chat.receiver.user_id },
                    { 'sender.user_id': chat.receiver.user_id, 'receiver.user_id': chat.sender.user_id }
                ]
            });

            const chatIds = chats.map(chat => chat._id);

            const message = await messageModel.findOne({ chat_id: { $in: chatIds } })
                .sort({ date: -1 })
                .limit(1);

            return {
                ...chat.toObject(),
                last_message: message ? message.text : "No hay mensajes",
                last_message_sender: message ? message.sender_name : "Desconocido",
            };
        }));

        res.status(200).json(chatDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al recuperar los chats", error: error.message });
    }
};



/**
 * Te devuelve los mensajes del chat
 */
const getMessages = async (req, res) => {
    const chatId = req.params.id;

    try {
        // Encuentra los chat_id donde el usuario actúa como sender y como receiver
        const chat = await chatModel.findOne({ _id: chatId });

        const chats = await chatModel.find({
            $or: [
                { 'sender.user_id': chat.sender.user_id, 'receiver.user_id': chat.receiver.user_id },
                { 'sender.user_id': chat.receiver.user_id, 'receiver.user_id': chat.sender.user_id }
            ]
        });

        await chatModel.updateOne({ _id: chatId }, { $set: { unread_messages: 0 } });

        const chatIds = chats.map(chat => chat._id);

        const messages = await messageModel.find({ chat_id: { $in: chatIds } })
            .sort({ date: -1 })
            .limit(50);

        const orderedMessages = messages.reverse();

        res.status(200).json(orderedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al recuperar los mensajes", error: error.message });
    }
};

/**
 * Envia un mensaje
 */
const sendMessage = async (req, res, io) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user._id;

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat no encontrado." });
        }

        const inverseChat = await chatModel.findOne({
            'sender.user_id': chat.receiver.user_id,
            'receiver.user_id': chat.sender.user_id
        });

        if (inverseChat) {
            // Incrementar unread_messages en 1 para el chat inverso
            inverseChat.unread_messages += 1;
            await inverseChat.save();
        }

        const message = new messageModel({
            chat_id: chatId,
            sender_id: senderId,
            sender_name: req.user.name,
            receiver_id: chat.receiver.user_id,
            receiver_name: chat.receiver.name,
            text: text,
            date: new Date(),
            status: 'delivered'
        });

        await message.save();

        // Emitir el mensaje al receptor a través de socket.io
        console.log('se abre canal a: ' + chat.receiver.user_id.toString())
        global.io.to(chat.receiver.user_id.toString()).emit('newMessage', message);

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar el mensaje", error: error.message });
    }
};





module.exports = { findOrCreateChat, getChats, getMessages, sendMessage }