const express = require("express");
const router = express.Router();

const upload = require("../middleware/multerConfig"); //multer middleware
const multer = require("multer");

let uploadHandler = upload.single("profilePic");

//upload profile pic
router.post("/profile", (req, res) => {
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(200).send("Profile Uploaded Successfully");
    }
  });
});

module.exports = router;
