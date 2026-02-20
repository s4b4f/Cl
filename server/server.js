const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const chatSocket = require('./src/sockets/chatSocket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

chatSocket(io);

server.listen(PORT, () => {
  console.log(`서버 켜짐! http://localhost:${PORT}`);
});