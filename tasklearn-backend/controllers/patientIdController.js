const PatientId = require("../models/patientIdModel");


const fetchPatientId = async (req, res) => {
  const { createdId } = req.params;

  try {
    if(createdId){
       const patientId = await PatientId.findOne({ createdId });
       if (!patientId) {
         res.status(400).json({ message: "Failed to fetch patientId", error });
       }

       res.status(200).json(patientId);

    }
   
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patientId", error });
  }
};

//create patientId

const createPatientId = async (req, res) => {
  try {
    const patientId = new PatientId(req.body);

    await patientId.save();
    res.status(201).json({ patientId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create patientId", error });
  }
};

const updatePatientId = async (req, res) => {
  const { createdId } = req.params;
  const { updatedPatientId } = req.body;
  try {
    if (createdId && updatedPatientId) {
      const patientid = await PatientId.findOneAndUpdate(
        { createdId }, // Query to find the document
        { $set: { patientId: updatedPatientId } }, // Update only the patientId field
        { new: true } // Return the updated document
      );
      if (!patientid) {
        return res.status(404).json({ message: "Patient ID not found" });
      }
      return res.status(200).json({ patientId: patientid.patientId });
    } else {
      return res
        .status(400)
        .json({ message: "Both createdId and updatedPatientId are required" });
    }
  } catch (error) {
    console.error("Error updating patient ID:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createPatientId,
  fetchPatientId,
  updatePatientId,
};