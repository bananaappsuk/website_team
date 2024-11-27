// routes/quizRoutes.js
const express = require('express');
const {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  updateQuizVisibility,
  getFollowerQuizzes,
  getPublicQuizzes,
  saveQuizzes,
  getSavedQuizzes,
  deleteSavedQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.get('/:id', getQuizzes);
router.get('/feed/:id',getFollowerQuizzes)
router.get('/feed/public/:id',getPublicQuizzes)
router.get('/feed/saved/all/:id',getSavedQuizzes)
router.patch("/feed/saved/delete/:id", deleteSavedQuizzes);
router.delete('/:id', deleteQuiz);
router.patch("/:id", updateQuizVisibility);
router.patch("/save/:id",saveQuizzes)

module.exports = router;
