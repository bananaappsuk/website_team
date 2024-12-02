// middleware/authMiddleware.js
const admin = require('../firebaseAdmin'); // Import initialized admin SDK

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Set user information in the request
    next(); // Allow request to continue to the route
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = verifyToken;