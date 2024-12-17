const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure if the database connection fails
  });

  const verifyToken = require('./middleware/authMiddleware');

// Define routes
const taskRoutes = require('./routes/taskRoutes');
const quizRoutes = require('./routes/quizRoutes'); // New quiz routes
const convertQuizRoutes = require('./routes/convertQuizRoutes');
const libraryRoutes = require('./routes/libraryRoutes'); // New library routes
const convertLibraryRoutes = require('./routes/convertLibraryRoutes');
const profileRoutes = require("./routes/profileRoutes");
const serverRoutes = require('./routes/serverRoutes');
const patientRoutes = require('./routes/patientIdRoutes');


app.use('/api/tasks', verifyToken, taskRoutes);
app.use("/api/task", verifyToken, taskRoutes); 
app.use('/api/quizzes', verifyToken, quizRoutes); // Use quiz routes
app.use('/api/convertQuizzes', verifyToken, convertQuizRoutes);
app.use('/api/libraries', verifyToken, libraryRoutes); // Use library routes
app.use('/api/convertLibraries', verifyToken, convertLibraryRoutes);
app.use("/api/upload", verifyToken, profileRoutes);
app.use('/api/servers', verifyToken, serverRoutes);
app.use('/api/patientId', verifyToken, patientRoutes);


// Root route for testing the API
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the task! </h1>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
