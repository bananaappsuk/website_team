// controllers/serverController.js
const Server = require('../models/serverModel');
const s3 = require('../config/awsConfig');

const createServer = async (req, res) => {

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
       const memberList =[createdByUserId];
        const newServer = new Server({
          channelId: data.Key,
          channelName,
          channelType,
          createdByUserId,
          channelImage: data.Location, // S3 image URL
          memberList: memberList
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

const deleteServer = async (req, res) => {
    const { id } = req.params; // Server ID from the route parameters

    try {
        // Find the server by ID
        const server = await Server.findById(id);

        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }

        // Delete the server image from S3
        const deleteParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: server.channelId, // The S3 object key stored in the database
        };

        try {
            await s3.deleteObject(deleteParams).promise();
        } catch (s3Error) {
            console.error("Error deleting file from S3:", s3Error);
            return res.status(500).json({ message: 'Error deleting server image from S3.', error: s3Error.message });
        }

        // Delete the server from the database
        await Server.findByIdAndDelete(id);

        res.status(200).json({ message: 'Server successfully deleted.' });
    } catch (error) {
        console.error("Error deleting server:", error);
        res.status(500).json({ message: 'Error deleting server.', error: error.message });
    }
};
const getServerMembers = async (req, res) => {
    const { id } = req.params; // Server ID from URL

    try {
        const server = await Server.findById(id);
        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }

        res.status(200).json({ members: server.memberList });
    } catch (error) {
        console.error("Error fetching server members:", error);
        res.status(500).json({ message: 'Error fetching server members.', error: error.message });
    }
};
/** 
const removeServerMember = async (req, res) => {
    const { serverId, userId } = req.params;  

    try {
        if (!serverId || !userId) {
            return res.status(400).json({ message: "Server ID and User ID are required." });
        }

        const server = await Server.findById(serverId);

        if (!server) {
            return res.status(404).json({ message: "Server not found." });
        }

        // Check if the user is actually a member
        if (!server.memberList.includes(userId)) {
            return res.status(400).json({ message: "User is not a member of the server." });
        }

        // Remove the user from the server's member list
        const updatedServer = await Server.findByIdAndUpdate(
            serverId,
            { $pull: { memberList: userId } },
            { new: true } 
        );

        if (!updatedServer) {
            return res.status(500).json({ message: "Failed to remove the user from the server." });
        }

        return res.status(200).json({
             message: "User removed successfully from the server.",updatedServer
            
            });

    } catch (error) {
        console.error("Error removing user from server:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};*/

const removeServerMember = async (req, res) => {
    const { serverId, userId } = req.params;

    try {
        if (!serverId || !userId) {
            return res.status(400).json({ message: "Server ID and User ID are required." });
        }

        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: "Server not found." });
        }

        if (!server.memberList.includes(userId)) {
            return res.status(400).json({ message: "User is not a member of the server." });
        }

        const updatedServer = await Server.findByIdAndUpdate(
            serverId,
            { $pull: { memberList: userId } },
            { new: true }
        );

        if (!updatedServer) {
            return res.status(500).json({ message: "Failed to remove the user from the server." });
        }

        return res.status(200).json({
            message: "User removed successfully from the server.",
        });

    } catch (error) {
        console.error("Error removing user from server:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};
{/** 
const exitServer = async (req, res) => {
    const { serverId } = req.params;
    const userId = req.user.id;

    if (!serverId) {
        return res.status(400).json({ message: 'Server ID is required.' });
    }

    try {
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }

        // Prevent the owner from leaving without transferring ownership
        if (server.createdByUserId === userId) {
            return res.status(400).json({ message: 'Server owners cannot exit. Transfer ownership first.' });
        }

        // Remove the user from the server's member list
        const updatedServer = await Server.findByIdAndUpdate(
            serverId,
            { $pull: { memberList: userId } },
            { new: true } // Ensure we get the updated server
        );

        if (!updatedServer) {
            return res.status(500).json({ message: 'Failed to update server.' });
        }

        return res.status(200).json({ message: 'Successfully exited the server.', updatedServer });
    } catch (error) {
        console.error('Error in exitServer controller:', error);
        return res.status(500).json({ message: 'An error occurred while trying to exit the server.' });
    }
};*/}
const exitServer = async (req, res) => {
    const { serverId } = req.params;
    const userId = req.user.uid;

    if (!serverId) {
        return res.status(400).json({ message: 'Server ID is required.' });
    }

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. User ID not found.' });
    }

    try {
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: 'Server not found.' });
        }

        if (server.createdByUserId === userId) {
            return res.status(400).json({ message: 'Server owners cannot exit. Transfer ownership first.' });
        }

        const updatedServer = await Server.findByIdAndUpdate(
            serverId,
            { $pull: { memberList: userId }, updatedDate: new Date() },
            { new: true }
        );

        if (!updatedServer) {
            return res.status(500).json({ message: 'Failed to update server.' });
        }
       
        if (updatedServer.memberList.length === 1 && updatedServer.memberList[0] === server.createdByUserId) {
            // This means the only remaining member is the creator, so mark as deleted
            updatedServer.isDeleted = true;
            updatedServer.updatedDate = new Date();
            await updatedServer.save(); // Ensure this save operation is successful
            console.log('Server has been marked as deleted:', updatedServer);
        }
        

        return res.status(200).json({ 
            message: 'Successfully exited the server.', 
            updatedServer: updatedServer.toObject()
        });

    } catch (error) {
        console.error('Error in exitServer controller:', error);
        return res.status(500).json({ message: 'An error occurred while trying to exit the server.', error: error.message });
    }
};



// Don't forget to export the new function
module.exports = { createServer, getServers, joinServer, getServerById, deleteServer,getServerMembers,removeServerMember,exitServer };