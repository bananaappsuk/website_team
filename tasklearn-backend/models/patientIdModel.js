const mongoose = require("mongoose");

const patientIdSchema = new mongoose.Schema({
  patientId: {
    type: String,
  },
  createdId: {
    type: mongoose.Types.ObjectId,
    ref: "Server",
  },
});

const PatientId = mongoose.model("PatientId", patientIdSchema);

module.exports = PatientId;