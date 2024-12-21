const axios  = require('axios')
const { getSeparated, postpoll } = require('../controls/utills');

let messageQueue = [];
let numbers;
let isProcessing = false;

async function processQueue() {
  if (isProcessing || messageQueue.length === 0) return;
  isProcessing = true;
  while (messageQueue.length > 0) {
    let obj = messageQueue.shift(); // Get the next message
    let data = obj.message.text;

    if ((numbers !== undefined && data.indexOf(`${numbers + 1}.`) === -1) && !/^[^\d]*1\.(?!\d)/.test(data.substr(0, 60))) {
      messageQueue.push(obj);
      isProcessing = false;
      return processQueue();
    } else if (/^[^\d]*1\.(?!\d)/.test(data.substr(0, 60))) {
      numbers = null;
    }
    let array = getSeparated(data, numbers);
    let questions = array[0];
    let answers = array[1];
    numbers = numbers ? array[2] : questions.length;

    for (let i = 0; i < questions.length; i++) {
      await new Promise(resolve => setTimeout(async () => {
        await postpoll(questions[i], answers[i]);
        resolve();
      }, 3000));
    }
  }
  isProcessing = false;
}

module.exports = async (req, res) => {
  let obj = req.body;
  processQueue();
  if (obj.hasOwnProperty('message') && obj.message.hasOwnProperty('text') && ['SofaAwAs', 'YoussefE16', 'YMYquestions'].includes(req.body.message.from.username) && obj.message.chat.type === 'private') {
    messageQueue.push(obj);
    processQueue();
  }
  res.status(200).send('file a report');
};
