// routes/quizRoutes.js
const express = require('express');
const { createQuiz, getQuizzes, deleteQuiz } = require('../controllers/quizController');

const router = express.Router();

router.post('/', createQuiz);
router.get('/', getQuizzes);
router.delete('/:id', deleteQuiz);

module.exports = router;
