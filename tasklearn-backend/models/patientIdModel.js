const mongoose = require("mongoose");

const patientIdSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    default: "TL000001",
  },
});

const PatientId = mongoose.model("PatientId", patientIdSchema);

module.exports = PatientId;
