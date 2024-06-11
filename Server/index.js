

// Importing the required modules
import { createServer } from 'http';  // HTTP server module
import { Server } from 'socket.io';  // Socket.IO server module

import natural from 'natural';

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");
// Creating a new HTTP server instance

const httpServer = createServer();

// Creating a new Socket.IO server instance

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500","http://127.0.0.1:5500"]
  }
});

function interpretSentimentScore(sentimentScore) {
  if (sentimentScore > 0) {
    return "Positive";
  }
  if (sentimentScore === 0) {
    return "Neutral";
  }
  return "Negative";
}

io.on('connection', socket=> {
  console.log('a user connected');

  // Sending a message to all connected clients

  io.emit('message', 'User connected!');

  // Listening for disconnection and logging a message

  socket.on('disconnect', () => { 
    console.log('user disconnected');
  });

  // Listening for messages and logging and emitting the message back to all clients

  socket.on('message', (data) => {
    if (typeof data === 'string') {
      console.log(`received: ${data}`);
      const result = analyzer.getSentiment(data.trim().split(' '));
      const sentiment = interpretSentimentScore(result);
      io.emit('message', `Comment: ${data} is ${sentiment}`);
    } else {
      console.log(`received invalid data: ${JSON.stringify(data)}`);
    }
  });
// Starting the HTTP server on port 3000 and logging a message
})

httpServer.listen(3000, () => {
  console.log('listening on port 3000');
})




