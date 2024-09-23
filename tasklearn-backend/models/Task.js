const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  createdBy: String,
  taggedStaff: String,
  contributingStaff: String,
  taskName: String,
  history: String,
  examination: String,
  diagnosis: String,
  plan: String,
  followUp: String,
  postConsultation: String,
  feedback: String,
  keyLearningPoint: String,
  action: String,
  Library: Boolean,
  Learn: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;