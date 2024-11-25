// models/quizModel.js
const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
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

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;