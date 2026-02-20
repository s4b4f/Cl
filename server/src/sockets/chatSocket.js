const prisma = require('../config/db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('유저 접속:', socket.id);

    socket.on('channel:join', (channelId) => {
      socket.join(channelId);
      console.log(`${socket.id} → 채널 ${channelId} 입장`);
    });

    socket.on('message:send', async (data) => {
      try {
        const { content, channelId, userId } = data;
        const message = await prisma.message.create({
          data: { content, channelId, userId },
          include: { user: { select: { username: true, avatar: true } } }
        });
        io.to(channelId).emit('message:new', message);
      } catch (err) {
        socket.emit('error', { error: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('유저 나감:', socket.id);
    });
  });
};