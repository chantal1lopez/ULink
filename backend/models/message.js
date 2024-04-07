const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    sender_name: { type: String, required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver_name: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['delivered', 'read'], default: 'delivered' }
}, {
    timestamps: true
});

module.exports = mongoose.model("Message", MessageSchema);
