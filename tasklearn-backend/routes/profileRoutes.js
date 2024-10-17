const express = require("express");
const router = express.Router();

const upload = require("../middleware/multerConfig"); //multer middleware

//upload profile pic
router.post("/profile", upload.single("profilePic"), (req, res) => {
  try {
    if (req.file) {
      res
        .status(200)
        .json({ message: "profile uploaded", profilePicUrl: req.file.location });
    }
  } catch (err) {
    res.status(400).json({error:err.message});
  }
});
module.exports = router;
