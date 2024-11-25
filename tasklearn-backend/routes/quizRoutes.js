// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  updateQuizVisibility,
  getFollowerQuizzes,
  getPublicQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.get('/:id', getQuizzes);
router.get('/feed/:id',getFollowerQuizzes)
router.get('/feed/public/:id',getPublicQuizzes)
router.delete('/:id', deleteQuiz);
router.patch("/:id", updateQuizVisibility);

module.exports = router;
