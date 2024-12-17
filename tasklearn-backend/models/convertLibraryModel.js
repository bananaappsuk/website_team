// models/convertLibraryModel.js
const mongoose = require("mongoose");

const convertLibrarySchema = new mongoose.Schema({
  keyLearningPoint: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  serverId: {
    type: mongoose.Types.ObjectId,
    ref: "Server",
    required: true,
  },
  taskId: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
    required: true,
  },
});

const convertLibrary = mongoose.model("convertLibrary", convertLibrarySchema);
module.exports = convertLibrary;