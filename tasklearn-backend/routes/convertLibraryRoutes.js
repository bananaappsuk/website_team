// routes/quizRoutes.js
const express = require('express');
const { createLibrary, getLibraries } = require('../controllers/convertLibraryController');

const router = express.Router();

router.post('/', createLibrary);
router.get('/', getLibraries);

module.exports = router;
