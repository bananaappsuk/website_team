// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  getQuizzesByServerId,
  getQuizzesByTaskId,
  getQuizzes,
  deleteQuizByTaskId,
} = require("../controllers/ConvertQuizController");

const router = express.Router();

router.post('/', createQuiz);
router.get("/:id", getQuizzes);
router.delete("/task/:id", deleteQuizByTaskId);
router.get("/server/:id", getQuizzesByServerId);
router.get("/taskBy/:id",getQuizzesByTaskId);


module.exports = router;