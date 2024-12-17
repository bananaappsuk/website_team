// routes/serverRoutes.js
const express = require('express');
const { createServer, getServers, joinServer, getServerById, deleteServer } = require('../controllers/serverController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to create a new server
router.post('/', upload.single('serverImage'), createServer);
router.get('/', getServers);
router.post('/join', joinServer);
router.get('/:id', getServerById);
router.delete('/:id', deleteServer);

module.exports = router;
