const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fileProcessor = require('./fileProcessor');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('log', { data: 'Connected to server' });
  
  fileProcessor.init(io);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
