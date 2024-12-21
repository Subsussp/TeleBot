// const axios = require("axios");
// require('dotenv').config()
// // Set up your API key
// const openai = new ({
//   apiKey: process.env.API_KEY, // Replace with your OpenAI API key
// });
// let getquiz = async () =>{
//     // Import the OpenAI library
//   try {
//     // Send a message to the ChatGPT API
//     const response = await ({
//       model: 'gpt-3.5-turbo-0125', // You can use 'gpt-4' as well
//       messages: [
//         { role: 'user', content: 'Hello, how are you?' },
//       ],
//     });
//     // Output the response
//     console.log('ChatGPT says:', response);
//     return response
// } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//   }
// }
// module.exports = getquiz