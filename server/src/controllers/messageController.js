const prisma = require('../config/db');

const sendMessage = async (req, res) => {
  try {
    const { content, channelId, userId } = req.body;
    const message = await prisma.message.create({
      data: { content, channelId, userId },
      include: { user: { select: { username: true, avatar: true } } }
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await prisma.message.findMany({
      where: { channelId },
      include: { user: { select: { username: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { sendMessage, getMessages };