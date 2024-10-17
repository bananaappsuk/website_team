const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: String, required: true }, // Firebase User ID
  channels: [channelSchema],
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
