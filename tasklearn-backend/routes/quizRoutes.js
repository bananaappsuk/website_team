// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  updateQuizVisibility,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.get('/:id', getQuizzes);
router.delete('/:id', deleteQuiz);
router.patch("/:id", updateQuizVisibility);

module.exports = router;
