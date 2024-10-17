// routes/quizRoutes.js
const express = require('express');
const { createuser } = require('../controllers/usercontroller');

const router = express.Router();

router.post('/', createuser);

module.exports = router;
