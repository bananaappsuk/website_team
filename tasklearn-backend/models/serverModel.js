// models/serverModel.js
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
    channelType: {
        type: String,
        enum: ['friends', 'community'], // Ensure these match your frontend options
        required: true,
    },
  channelName: { type: String, required: true },
  channelImage: { type: String, required: true },
  createdByUserId: { type: String, required: true },
  memberList: { type: [String], default: [] },
});

const Server = mongoose.model('Server', serverSchema);
module.exports = Server;
