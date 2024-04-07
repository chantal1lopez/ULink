const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    city: { type: String, default: '' },
    country: { type: String, default: '' }
}, { _id: false });

const ArticleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    language: { type: String, default: '' },
    location: { type: LocationSchema, default: () => ({}) },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    author_name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    categories: [{ type: String, default: '' }]
}, {
    timestamps: true 
});

module.exports = mongoose.model("Article", ArticleSchema);
