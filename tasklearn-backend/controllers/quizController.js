// controllers/quizController.js
const Quiz = require("../models/quizModel");
const Task = require("../models/Task");
const Library = require("../models/libraryModel");
const Server = require("../models/serverModel");


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
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getPublicQuizzes = async (req, res) => {
  const { id } = req.params; // Current user ID
  const fetchId = req.query.fetchId ? req.query.fetchId.split(",") : []; // Handle fetchId as an array
  try {
    // Fetch servers where memberList includes id
    const servers = await Server.find({
      memberList: { $elemMatch: { $eq: id } },
    });
    const serverIds = servers.map((server) => server._id);
    let allQuizzes = [];
    // Loop through each serverId and fetch the public quizzes
    let quiz1 = [];
    for (const serverId of serverIds) {
      const quizzes2 = await Quiz.find({
        serverId: serverId,
        visibility: "public",
        $or: [
          { createdBy: { $ne: id } }, // Exclude current user
        ],
      });
      quiz1 = quiz1.concat(quizzes2);
    }
    let quiz2 = [];
    for (const followee of fetchId) {
      const quizzes = await Quiz.find({
        visibility: "public",
        // Exclude current user
        createdBy: followee, // Include each followerId one by one
      });
      quiz2 = quiz2.concat(quizzes);
    }
    // Combine quiz1 and quiz2
    allQuizzes = quiz1.concat(quiz2); // Send the combined quizzes as response
    res.status(200).json(allQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const saveQuizzes = async (req, res) => {
  const { id } = req.params;
  const { savedBy } = req.body;

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Check if user has already saved this quiz by index
    const index = quiz.savedBy.indexOf(savedBy);
    if (index > -1) {
      // Remove user ID from the array
      quiz.savedBy.splice(index, 1);
    } else {
      // Add user ID to the array
      quiz.savedBy.push(savedBy);
    }

    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to save quiz", error });
  }
};

const getSavedQuizzes = async (req, res) => {
  const { id } = req.params;
  try {
    const quizzes = await Quiz.find({
      visibility: { $in: ["followers", "public", "onlyMe"] },
      savedBy: { $in: [id] }, // Check if userId is in the savedBy array
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to saved quiz", error });
  }
};

const deleteSavedQuizzes = async (req, res) => {
  const { id } = req.params;

  const { savedBy } = req.body;
  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    // Check if user has already saved this quiz by index
    const index = quiz.savedBy.indexOf(savedBy);
    if (index > -1) {
      // Remove user ID from the array
      quiz.savedBy.splice(index, 1);
    }
    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete saved quiz", error });
  }
};

const getFollowerQuizzesOtherProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.find({
      createdBy: id,
      visibility: "followers",
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve quizzes", error });
  }
};

const getPublicQuizzesOtherProfile = async (req, res) => {
  const uids = req?.query?.uids;
  const fetchId = req.query.fetchId ? req.query.fetchId.split(",") : [];
  const uidArray = uids.split(",");
  try {
    const [otherUid, userUid] = uidArray;
    // Find quizzes created by the other user
    const quizzess = await Quiz.find({
      createdBy: otherUid,
      visibility: "public",
    });
    const serverIds = quizzess.map((quiz) => quiz.serverId);
    // Find new server IDs where the user is a member
    let newServerIds = [];
    for (const serverId of serverIds) {
      try {
        const servers = await Server.find({
          _id: serverId,
          memberList: { $elemMatch: { $eq: userUid } },
        });
        newServerIds = newServerIds.concat(servers.map((server) => server._id));
      } catch (err) {
        console.error(`Error finding server with id ${serverId}:`, err);
      }
    }
    let allQuizzes = [];
    for (const serverId of newServerIds) {
      try {
        const quiz = await Quiz.find({
          serverId: serverId,
          visibility: "public",
          createdBy: otherUid,
        });
        allQuizzes = allQuizzes.concat(quiz);
      } catch (err) {
        console.error(`Error finding quizzes with serverId ${serverId}:`, err);
      }
    }
    let additionalQuizzes = [];
    for (const followeeId of fetchId) {
      try {
        const quiz2 = await Quiz.find({
          visibility: "public",
          $or: [
            { createdBy: { $ne: otherUid } }, // Exclude current user
            { createdBy: followeeId }, // Include each followerId one by one
          ],
        });
        additionalQuizzes = additionalQuizzes.concat(quiz2);
      } catch (err) {
        console.error(
          `Error finding quizzes for followeeId ${followeeId}:`,
          err
        );
      }
    }
    // Combine all quizzes
    const quiz = allQuizzes.concat(additionalQuizzes);
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Failed to retrieve quizzes:", error);
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
  saveQuizzes,
  getSavedQuizzes,
  deleteSavedQuizzes,
  getPublicQuizzesOtherProfile,
  getFollowerQuizzesOtherProfile,
};