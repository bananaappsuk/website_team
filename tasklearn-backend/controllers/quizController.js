// controllers/quizController.js
const Quiz = require("../models/quizModel");
const Task = require("../models/Task");
const Library = require("../models/libraryModel");

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
    const quiz = new Quiz({
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
  console.log(id);
  try {
    const quizzes = await Quiz.find({ createdBy: id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getQuizzesByServerId = async (req, res) => {
  const { id } = req.params;

  try {
    const quizzes = await Quiz.find({ serverId: id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getQuizzesByTaskId = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.find({ taskId: id });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findOneAndDelete({ taskId: id });
    const library = await Library.findOneAndDelete({ taskId: id });
    const task = await Task.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to delete quiz", error });
  }
};

const deleteQuizByTaskId = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findOneAndDelete({ taskId: id });
    const library = await Library.findOneAndDelete({ taskId: id });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to delete quiz", error });
  }
};

const updateQuizVisibility = async (req, res) => {
  const { id } = req.params;

  const { visibility } = req.body;

  if (!id) {
    return res.status(404).json({ message: "Quiz ID not found" });
  }
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        visibility,
      },
      { new: true }
    );
     res.status(200).json(quiz);
  } catch (error) {
    console.error("Error deleting quiz:", error);
  }
};

const getFollowerQuizzes = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.find({
      createdBy: id,
      visibility: "followers",
      isSaved: false,
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getPublicQuizzes = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.find({
      createdBy: id,
      visibility: "public",
      isSaved: false,
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

module.exports = {
  createQuiz,
  deleteQuiz,
  getQuizzesByServerId,
  getQuizzesByTaskId,
  deleteQuizByTaskId,
  getQuizzes,
  getPublicQuizzes,
  getFollowerQuizzes,
  updateQuizVisibility,
};
