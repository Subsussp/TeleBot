// models/Message.js

const mongoose = require('mongoose');

// Define the schema for storing messages
const messageSchema = new mongoose.Schema({
  messageId: { 
    type: String, 
    required: true, 
    unique: true  // Ensure each message has a unique ID
  },
  text: { 
    type: String, 
    required: true 
  },
  processed: { 
    type: Boolean, 
    default: false  // To track if the message has been processed
  },
  timestamp: { 
    type: Date, 
    default: Date.now // Automatically set the timestamp of the message
  }
});

// Create the model using the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;  // Export the model so it can be used in other files
