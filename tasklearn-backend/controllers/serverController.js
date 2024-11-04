// controllers/serverController.js
const Server = require('../models/serverModel');
const s3 = require('../config/awsConfig');

const createServer = async (req, res) => {
    console.log('Request body:', req.body); // Check incoming body
    console.log('Uploaded file:', req.file); // Check uploaded file

    const { channelName, channelType, createdByUserId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // Validate required fields
    if (!channelName || !channelType || !createdByUserId) {
        return res.status(400).json({ message: 'channelName, channelType, and createdByUserId are required.' });
    }

    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Server_Image/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.upload(uploadParams).promise();
        const newServer = new Server({
            channelId: data.Key,
            channelName,
            channelType,
            createdByUserId,
            channelImage: data.Location, // S3 image URL
        });

        await newServer.save();
        res.status(201).json(newServer);
    } catch (error) {
        console.error('Error during S3 upload or saving server:', error); // Detailed error logging
        res.status(500).json({ message: 'Error uploading file or saving server data.', error: error.message });
    }
};

const getServers = async (req, res) => {
    try {
        const servers = await Server.find(); // Fetch all servers
        res.status(200).json(servers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching servers');
    }
};

// controllers/serverController.js

const joinServer = async (req, res) => {
    const { serverId, userId } = req.body;

    if (!serverId || !userId) {
        return res.status(400).json({ message: 'Server ID and User ID are required.' });
    }

    try {
        const server = await Server.findById(serverId);

        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }

        // Check if user is already a member
        if (server.memberList.includes(userId)) {
            return res.status(200).json({ message: 'User is already a member of this server.' });
        }

        // Add user to the server's member list
        server.memberList.push(userId);
        await server.save();

        res.status(200).json({ message: 'User successfully joined the server.', server });
    } catch (error) {
        console.error("Error adding user to server:", error);
        res.status(500).json({ message: 'Error adding user to server.', error: error.message });
    }
};

const getServerById = async (req, res) => {
    const { id } = req.params; // Get ID from route parameters

    try {
        const server = await Server.findById(id); // Fetch server by ID
        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }
        res.status(200).json(server);
    } catch (error) {
        console.error("Error fetching server by ID:", error);
        res.status(500).json({ message: 'Error fetching server.', error: error.message });
    }
};

// Don't forget to export the new function
module.exports = { createServer, getServers, joinServer, getServerById };