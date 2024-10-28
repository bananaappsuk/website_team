// routes/serverRoutes.js
const express = require('express');
const { createServer, getServers, joinServer, getServerById } = require('../controllers/serverController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to create a new server
router.post('/', upload.single('serverImage'), createServer);
router.get('/', getServers);
router.post('/join', joinServer);
router.get('/:id', getServerById);

module.exports = router;
