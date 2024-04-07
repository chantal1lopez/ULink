const mongoose = require("mongoose");

const SocialMediaSchema = new mongoose.Schema({
    instagram: { type: String, default: '' },
    web: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
}, { _id: false });

const LocationSchema = new mongoose.Schema({
    city: { type: String, default: '' },
    country: { type: String, default: '' }
}, { _id: false });


const ParticipantSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    location: { type: LocationSchema, default: () => ({}) },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: '' },
    image: { type: String, default: '' },
    location: { type: LocationSchema, default: () => ({}) },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    categories: [{ type: String, default: '' }],
    collaborators: { type: [ParticipantSchema], default: [] },
    investors: { type: [ParticipantSchema], default: [] },
    social_media: { type: SocialMediaSchema, default: () => ({}) },
    search_investors: { type: Boolean, default: false },
    search_collaborators: { type: Boolean, default: false },
    close: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model("Project", ProjectSchema);
