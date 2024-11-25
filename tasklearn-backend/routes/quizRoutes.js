// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  deleteQuiz,
  getQuizzesByServerId,
  getQuizzesByTaskId,
  deleteQuizByTaskId,
  getQuizzes,
  getPublicQuizzes,
  getFollowerQuizzes,
  updateQuizVisibility,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.get("/:id", getQuizzes);
router.delete('/:id', deleteQuiz);
router.delete("/task/:id", deleteQuizByTaskId);
router.get("/server/:id", getQuizzesByServerId);
router.get("/taskBy/:id",getQuizzesByTaskId);
router.get("/feed/:id",getFollowerQuizzes)
router.get("/feed/public/:id",getPublicQuizzes)
router.patch("/visibility/:id",updateQuizVisibility)
module.exports = router;