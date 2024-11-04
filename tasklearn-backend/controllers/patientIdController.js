const PatientId = require("../models/patientIdModel");

const Counter = require("../models/counterModel");

const fetchPatientId = async (req, res) => {
  try {
    const patientId = await PatientId.find();
    if (!patientId) {
      res.status(400).json({ message: "Failed to fetch patientId", error });
    }
    res.status(200).json(patientId);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patientId", error });
  }
};

const updateCount = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "patientId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true } // Create if not exists
  );

  return "TL" + String(counter.value).padStart(6, "0");
};

//create patientId

const createPatientId = async (req, res) => {
  try {
    const patientId = new PatientId();

    await patientId.save();

    const newCounter = await Counter.findOneAndUpdate(
      { key: "patientId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true } // Create if not exists
    );
    await newCounter.save();

    res.status(201).json(patientId);
  } catch (error) {
    res.status(500).json({ message: "Failed to create patientId", error });
  }
};

const updatePatientId = async (req, res) => {
  try {
    const patientId = await updateCount();
    const patientid = await PatientId.findOneAndUpdate({
      patientId,
    });

    await patientid.save();
    res.status(201).json({ patientId: patientid.patientId });
  } catch (error) {
    console.error("Error updating patient ID:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createPatientId,
  fetchPatientId,
  updatePatientId,
  updateCount,
};