const admin = require('firebase-admin');

const serviceAccount = require('./ServiceAccountKey/serviceAccountKey.json'); // Update path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;