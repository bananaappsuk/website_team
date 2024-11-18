const express = require("express");

const {
  createPatientId,
  fetchPatientId,
  updatePatientId,
} = require("../controllers/patientIdController");

const router = express.Router();

router.post("/new", createPatientId);

router.get("/fetch/:createdId", fetchPatientId);

router.patch("/update/:createdId", updatePatientId);

module.exports = router;