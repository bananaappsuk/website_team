const mongoose = require('mongoose');

const users = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  confirmpassword: String,
  jobrole: String,
  uploadprofilepicture: String,
  //termsaccepted: Boolean,
});

const user = mongoose.model('user', users);

module.exports = user;