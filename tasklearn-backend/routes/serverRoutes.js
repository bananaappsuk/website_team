const express = require('express');
const router = express.Router();
const Server = require('../models/serverModel');
const Task = require('../models/Task');

// Create a new server
router.post('/', async (req, res) => {
  const { name, createdBy } = req.body;
  
  try {
    const server = new Server({ name, createdBy });
    await server.save();
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ message: 'Error creating server', error });
  }
});

// Create a new channel in a server
router.post('/:serverId/channels', async (req, res) => {
    const { serverId } = req.params;
    const { name } = req.body;

    console.log('Received serverId:', serverId); // Debugging line

    try {
        const server = await Server.findById(serverId);
        if (!server) return res.status(404).json({ message: 'Server not found' });

        server.channels.push({ name, tasks: [] });
        await server.save();
        res.status(201).json(server);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Error creating channel', error });
    }
});

// Create a task in a specific channel
router.post('/:serverId/channels/:channelId/tasks', async (req, res) => {
  const { serverId, channelId } = req.params;
  const taskData = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    const channel = server.channels.id(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const task = new Task(taskData);
    await task.save();

    channel.tasks.push(task._id);
    await server.save();

    res.status(201).json({ message: 'Task added to channel', task });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

module.exports = router;
