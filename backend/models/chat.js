const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
    sender: ParticipantSchema,
    receiver: ParticipantSchema,
    unread_messages: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model("Chat", ChatSchema);
