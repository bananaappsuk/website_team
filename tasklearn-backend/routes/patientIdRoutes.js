const express = require("express");

const {
  createPatientId,
  fetchPatientId,
  updatePatientId,
} = require("../controllers/patientIdController");

const router = express.Router();

router.post("/new", createPatientId);

router.get("/fetch", fetchPatientId);

router.patch("/update", updatePatientId);

module.exports = router;
