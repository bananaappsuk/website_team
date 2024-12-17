// controllers/quizController.js
const convertQuiz = require("../models/convertQuizModel");
const Task = require("../models/Task");
const convertLibrary = require("../models/convertLibraryModel");

// Create a new quiz
const createQuiz = async (req, res) => {
  const { keyLearningPoint, action, createdBy, Library, serverId, taskId } =
    req.body;

  if (!keyLearningPoint || !action) {
    return res
      .status(400)
      .json({ message: "Key Learning Point and Action are required" });
  }

  try {
    const quiz = new convertQuiz({
      keyLearningPoint,
      action,
      createdBy,
      Library,
      serverId,
      taskId,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error });
  }
};

const getQuizzes = async (req, res) => {
  const { id } = req.params;
  try {
    const quizzes = await convertQuiz.find({ createdBy: id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getQuizzesByServerId = async (req, res) => {
  const { id } = req.params;
  try {
    const quizzes = await convertQuiz.find({ serverId: id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getQuizzesByTaskId = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await convertQuiz.find({ taskId: id });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const deleteQuizByTaskId = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await convertQuiz.findOneAndDelete({ taskId: id });
    const library = await convertLibrary.findOneAndDelete({ taskId: id });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to delete quiz", error });
  }
};



module.exports = {
  createQuiz,
  getQuizzesByServerId,
  getQuizzesByTaskId,
  getQuizzes,
  deleteQuizByTaskId,
};