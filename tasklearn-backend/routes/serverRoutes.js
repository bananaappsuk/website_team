// routes/serverRoutes.js
const express = require('express');
const { createServer, getServers, joinServer, getServerById, deleteServer,exitServer,removeServerMember,getServerMembers } = require('../controllers/serverController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to create a new server
router.post('/', upload.single('serverImage'), createServer);
router.get('/', getServers);
router.post('/join', joinServer);
router.get('/:id', getServerById);
router.delete('/:id', deleteServer);

router.get('/:id/server-members', getServerMembers);

// Route to remove a member from a server
router.delete('/:serverId/remove-member/:userId', removeServerMember);

// Route to exit a server
router.delete('/:serverId/exit', exitServer);


module.exports = router;
