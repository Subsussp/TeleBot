const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String, // or Number, depending on your use case
    required: true, // Make sure this is required if you're using it
  },
  text: {
    type: String,
    required: true, // Text field remains required
  },
  username: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
