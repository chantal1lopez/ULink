const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    city: { type: String, default: '' },
    country: { type: String, default: '' }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: LocationSchema, default: () => ({}) },
    image: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
});

const ArticleSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: LocationSchema, default: () => ({}) },
});

const FollowSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    location: { type: LocationSchema, default: () => ({}) },
    image: { type: String },
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    name: { type: String },
    location: {
        country: { type: String },
        city: { type: String }
    },
    image: { type: String },
    description: { type: String },
    following: [FollowSchema],
    followers: [FollowSchema],
    config: {
        search_projects: {
            invertir: { type: Boolean, default: false },
            colaborar: { type: Boolean, default: false },
        },
        search_users: {
            invertir: { type: Boolean, default: false },
            colaborar: { type: Boolean, default: false },
        }
    },
    projects: [ProjectSchema],
    articles: [ArticleSchema],
    profile: {
        contact: {
            email: { type: String },
            linkedin: { type: String },
            web: { type: String },
            twitter: { type: String },
            instagram: { type: String }
        },
        habilities: [String],
        projects: [ProjectSchema],
        interest: [String],
        languages: [String]
    },
    saved_projects: [{
        id: mongoose.Schema.Types.ObjectId,
        name: { type: String },
        location: { type: String }
    }],
    saved_articles: [ArticleSchema]
},
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("User", UserSchema);
