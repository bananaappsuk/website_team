// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  deleteQuiz,
  getQuizzesByServerId,
  getQuizzesByTaskId,
  deleteQuizByTaskId,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.delete('/:id', deleteQuiz);
router.delete("/task/:id", deleteQuizByTaskId);
router.get("/server/:id", getQuizzesByServerId);
router.get("/taskBy/:id",getQuizzesByTaskId)
module.exports = router;
