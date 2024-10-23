const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
  },
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
  isShared: {
    type: Boolean,
    required: true,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
