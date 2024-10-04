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

    res.status(200).json(updatedItem);
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
