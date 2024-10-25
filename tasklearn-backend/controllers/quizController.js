// controllers/quizController.js
const Quiz = require("../models/quizModel");

// Create a new quiz
const createQuiz = async (req, res) => {
  const { keyLearningPoint, action, Library } = req.body;

  if (!keyLearningPoint || !action) {
    return res
      .status(400)
      .json({ message: "Key Learning Point and Action are required" });
  }

  try {
    const quiz = new Quiz({ keyLearningPoint, action, Library });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to delete quiz", error });
  }
};

module.exports = { createQuiz, getQuizzes, deleteQuiz };
