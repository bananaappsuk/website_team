// routes/quizRoutes.js
const express = require('express');
const { createLibrary, getLibraries, deleteLibrary } = require('../controllers/libraryController');

const router = express.Router();

router.post('/', createLibrary);
router.get('/:id', getLibraries);
router.delete('/:id', deleteLibrary);

module.exports = router;
