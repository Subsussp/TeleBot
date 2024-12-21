// api/bot.js
const axios = require('axios');
const mongoose = require('mongoose');
const Message = require('../message.js');
const { getSeparated, postpoll } = require('../controls/utills');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let isProcessing = false;

async function processQueue() {
  if (isProcessing) return; // Prevent multiple processing
  isProcessing = true;

  // Get unprocessed messages from MongoDB
  const messages = await Message.find({ processed: false }).limit(10); // Limit the number of messages to process at once

  for (const message of messages) {
    let data = message.text;

    // Check for number increment or reset
    let numbers;
    if ((numbers !== undefined && data.indexOf(`${numbers + 1}.`) === -1) && !/^[^\d]*1\.(?!\d)/.test(data.substr(0, 60))) {
      continue; // Skip processing this message if it's out of order
    } else if (/^[^\d]*1\.(?!\d)/.test(data.substr(0, 60))) {
      numbers = null; // Reset numbers
    }

    // Separate questions and answers
    let array = getSeparated(data, numbers);
    let questions = array[0];
    let answers = array[1];
    numbers = numbers ? array[2] : questions.length;

    // Post each question with a delay
    for (let i = 0; i < questions.length; i++) {
      await new Promise(resolve => setTimeout(async () => {
        await postpoll(questions[i], answers[i]); // Assuming postpoll sends the question and answer somewhere
        resolve();
      }, 3000));
    }

    // Mark the message as processed
    await Message.findByIdAndUpdate(message._id, { processed: true });
  }

  isProcessing = false;
}

module.exports = async (req, res) => {
  let obj = req.body;

  // Ensure message is valid and from an allowed user
  if (obj.hasOwnProperty('message') && obj.message.hasOwnProperty('text') && ['SofaAwAs', 'YoussefE16', 'YMYquestions'].includes(obj.message.from.username) && obj.message.chat.type === 'private') {
    
    // Save message to the database
    const existingMessage = await Message.findOne({ messageId: obj.message.message_id });
    if (!existingMessage) {
      await Message.create({
        messageId: obj.message.message_id,
        text: obj.message.text,
      });
    }

    // Start processing the queue (if not already processing)
    await processQueue();
  }

  res.status(200).send('Message received and processing started...');
};
