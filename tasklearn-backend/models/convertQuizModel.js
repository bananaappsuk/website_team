// models/convertQuizModel.js
const mongoose = require('mongoose');

const convertQuizSchema = new mongoose.Schema({
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
  Library: {
    type: Boolean,
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
  visibility: {
    type: String,
    enum: ["onlyMe", "followers", "public"],
    default: "onlyMe",
  },
  savedBy: { type: [String], default: [] },
});

const convertQuiz = mongoose.model('convertQuiz', convertQuizSchema);
module.exports = convertQuiz;