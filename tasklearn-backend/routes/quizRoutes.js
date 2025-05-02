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
  saveQuizzes,
  getSavedQuizzes,
  deleteSavedQuizzes,
  getFollowerQuizzesOtherProfile,
  getPublicQuizzesOtherProfile,
  getQuizzesByContributingStaff,
} = require("../controllers/quizController");

const router = express.Router();

router.post('/', createQuiz);
router.get("/:id", getQuizzes);
router.delete('/:id', deleteQuiz);
router.delete("/task/:id", deleteQuizByTaskId);
router.get("/server/:id", getQuizzesByServerId);
router.get("/taskBy/:id",getQuizzesByTaskId);
router.get("/feed/:id",getFollowerQuizzes);
router.get("/feed/public/:id",getPublicQuizzes);
router.patch("/visibility/:id",updateQuizVisibility);
router.get('/feed/saved/all/:id',getSavedQuizzes);
router.patch("/feed/saved/delete/:id", deleteSavedQuizzes);
router.patch("/save/:id",saveQuizzes);
router.get("/feed/followers/:id",getFollowerQuizzesOtherProfile);
router.get("/all/feed/public",getPublicQuizzesOtherProfile);
router.get('/contributing-staff/:id', getQuizzesByContributingStaff);

module.exports = router;