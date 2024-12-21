const axios = require('axios');
const mongoose = require('mongoose');
const Message = require('../message'); // Import the Message model
const { getSeparated, postpoll } = require('../controls/utills');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

async function processMessages() {
  // Fetch the first pending message from the database
  const message = await Message.findOne({ status: 'pending' });

  if (message) {
    // Mark the message as processed to avoid processing it multiple times
    await Message.updateOne({ _id: message._id }, { $set: { status: 'processed' } });

    // Process the message
    await processMessage(message);
  } else {
    console.log('No pending messages to process');
  }
}

async function processMessage(message) {
  let numbers;
  let data = message.messageText;

  // Process the questions and answers
  let array = getSeparated(data, numbers);
  let questions = array[0];
  let answers = array[1];
  numbers = numbers ? array[2] : questions.length;

  // Send each question
  for (let i = 0; i < questions.length; i++) {
    await new Promise(resolve =>
      setTimeout(async () => {
        await postpoll(questions[i], answers[i]);
        resolve();
      }, 3000)  // Delay between each question
    );
  }
}


module.exports = async (req, res) => {
  const obj = req.body;

  // Ensure the required fields are provided
  if (obj && obj.message && obj.message.text && obj.message.messageId) {
    try {
      const newMessage = new Message({
        messageId: obj.message.messageId, // Provide the messageId
        text: obj.message.text,
        username: obj.message.from.username,
      });

      await newMessage.save();
      res.status(200).send('Message saved successfully');
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).send('Error saving message');
    }
  } else {
    res.status(400).send('Message text and messageId are required');
  }
};

