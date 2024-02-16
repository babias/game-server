const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
let connectedUsers = 0;

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Serve a message when accessing the root URL
app.get('/', (req, res) => {
  res.send('Server connected');
});

io.on('connection', (socket) => {
  connectedUsers++;

  // Display "Server connected" when a client connects
  console.log('Server connected');

  // Broadcast the updated user count to all clients
  io.emit('userCount', connectedUsers);

  socket.on('message', (message) => {
    // Broadcast the message to all clients, including the sender
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    connectedUsers--;

    // Broadcast the updated user count to all clients
    io.emit('userCount', connectedUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
