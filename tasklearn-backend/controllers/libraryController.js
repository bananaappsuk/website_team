// controllers/quizController.js
const Library = require("../models/libraryModel");

const Quiz = require("../models/quizModel");
const Task = require("../models/Task");

// Create a new library
const createLibrary = async (req, res) => {
  const { keyLearningPoint, action, createdBy, serverId, taskId } = req.body;

  if (!keyLearningPoint || !action) {
    return res
      .status(400)
      .json({ message: "Key Learning Point and Action are required" });
  }

  try {
    const library = new Library({
      keyLearningPoint,
      action,
      createdBy,
      serverId,
      taskId,
    });
    await library.save();
    res.status(201).json(library);
  } catch (error) {
    res.status(500).json({ message: "Failed to create library", error });
  }
};

const getLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    res.status(200).json(libraries);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve libraries", error });
  }
};

const deleteLibrary = async (req, res) => {
  const { id } = req.params;

  try {
    const library = await Library.findOneAndDelete({ taskId: id });
    const quiz = await Quiz.findOneAndDelete({ taskId: id });
    const task = await Task.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Error deleting library:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to delete library", error });
  }
};

module.exports = { createLibrary, getLibraries, deleteLibrary };
