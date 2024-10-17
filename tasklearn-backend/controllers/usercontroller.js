// controllers/quizController.js
const user = require('../models/user');
const users = require('../models/user');

// Create a new quiz
const createuser = async (req, res) => {
  const { userdetail } = req.body;

  if (!userdetail) {
    return res.status(400).json({ message: 'User details are required' });
  }

  try {
    const user = new users({ userdetail });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz', error });
  }
};
module.exports = { createuser};