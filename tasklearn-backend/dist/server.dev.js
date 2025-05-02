"use strict";

var express = require('express');

var mongoose = require('mongoose');

var cors = require('cors');

var dotenv = require('dotenv'); // Load environment variables from .env file


dotenv.config();
var app = express(); // Middleware
//app.use(cors({}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://65.0.204.147'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json()); // Connect to MongoDB

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connected to MongoDB');
})["catch"](function (error) {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1); // Exit process with failure if the database connection fails
});

var verifyToken = require('./middleware/authMiddleware'); // Define routes


var taskRoutes = require('./routes/taskRoutes');

var quizRoutes = require('./routes/quizRoutes'); // New quiz routes


var convertQuizRoutes = require('./routes/convertQuizRoutes');

var libraryRoutes = require('./routes/libraryRoutes'); // New library routes


var convertLibraryRoutes = require('./routes/convertLibraryRoutes');

var profileRoutes = require("./routes/profileRoutes");

var serverRoutes = require('./routes/serverRoutes');

var patientRoutes = require('./routes/patientIdRoutes');

app.use('/api/tasks', verifyToken, taskRoutes);
app.use("/api/task", verifyToken, taskRoutes);
app.use('/api/quizzes', verifyToken, quizRoutes); // Use quiz routes

app.use('/api/convertQuizzes', verifyToken, convertQuizRoutes);
app.use('/api/libraries', verifyToken, libraryRoutes); // Use library routes

app.use('/api/convertLibraries', verifyToken, convertLibraryRoutes);
app.use("/api/upload", verifyToken, profileRoutes);
app.use('/api/servers', verifyToken, serverRoutes);
app.use('/api/patientId', verifyToken, patientRoutes); // Root route for testing the API

app.get('/', function (req, res) {
  res.send('<h1>Welcome to the task!! </h1>');
}); // Error handling middleware

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred'
  });
}); // Handle 404 errors

app.use(function (req, res) {
  res.status(404).json({
    message: 'Route not found'
  });
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', function () {
  return console.log("Server running on port ".concat(PORT));
});