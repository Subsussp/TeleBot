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
  let obj = req.body;

  if (obj.hasOwnProperty('message') && obj.message.hasOwnProperty('text') && ['SofaAwAs', 'YoussefE16', 'YMYquestions'].includes(obj.message.from.username) && obj.message.chat.type === 'private') {
    // Save the message to the database
    const newMessage = new Message({
      messageId: obj.message.message_id.toString(),
      messageText: obj.message.text,
      username: obj.message.from.username,
      chatType: obj.message.chat.type
    });

    await newMessage.save(); // Save the message to the DB
    console.log('Message saved to DB');

    // Process pending messages
    await processMessages();
  }

  res.status(200).send('Message received and queued for processing');
};
