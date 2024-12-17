// controllers/quizController.js
const convertLibrary = require('../models/convertLibraryModel');
const convertQuiz = require("../models/convertQuizModel");
const Task = require("../models/Task");

// Create a new library
const createLibrary = async (req, res) => {
  const { keyLearningPoint, action, createdBy, serverId, taskId } = req.body;

  if (!keyLearningPoint || !action) {
    return res.status(400).json({ message: 'Key Learning Point and Action are required' });
  }

  try {
    const library = new convertLibrary({
      keyLearningPoint,
      action,
      createdBy,
      serverId,
      taskId,
    });
    await library.save();
    res.status(201).json(library);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create library', error });
  }
};

const getLibraries = async (req, res) => {
    try {
      const libraries = await convertLibrary.find();
      res.status(200).json(libraries);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve libraries', error });
    }
  };
  

module.exports = { createLibrary, getLibraries };