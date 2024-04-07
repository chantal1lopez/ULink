const mongoose = require("mongoose");

const FromUserSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  image: { type: String }
}, { _id: false });

const NotificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
  type: { type: String, enum: ['connection_request', 'collaboration_request', 'investment_request'], required: true },
  from_user: { type: FromUserSchema, required: true },
  project_id: { type: String }, 
  project_name: { type: String }, 
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Notification", NotificationSchema);
