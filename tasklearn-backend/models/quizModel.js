// models/quizModel.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
