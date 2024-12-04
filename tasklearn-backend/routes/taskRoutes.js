const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // Make sure your Task model is correctly referenced

// Create a new task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
});

// Search
router.get('/search', async (req, res) => {
  const { query, serverId } = req.query;

  if (!query?.trim() || !serverId) {
    return res
      .status(400)
      .json({ message: 'Query and serverId are required parameters' });
  }

  try {
    const escapeRegex = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapeRegex(query.trim()), 'i');

    const tasks = await Task.find({
      serverId,
      $or: [{ patientId: regex }, { createdBy: regex }],
      isDeleted: false,
    });

    res.status(200).json(tasks); // Always return an array
  } catch (error) {
    console.error('Error searching tasks:', error);
    res.status(500).json({ message: 'Error fetching search results', error });
  }
});

//get task by id

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    res.status(200).json(task);
    if (!task) {
      return res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error });
  }
});

//get task by serverId

router.get("/server/:serverId", async (req, res) => {
  const { serverId } = req.params;
  try {
    const task = await Task.find({serverId});
    res.status(200).json(task);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error });
  }
});

// update tasks
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedItem = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!updatedItem) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json({message:"task removed successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error Updating tasks", error });
  }
});

// update task for complete
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await Task.findByIdAndUpdate(
      id,
      { isCompleted: true,isShared:false },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Task Completed successfully", updatedItem });
    if (!updatedItem) {
      return res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error Updating tasks", error });
  }
});

//delete task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting tasks", error });
  }
});

module.exports = router;