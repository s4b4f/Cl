const prisma = require('../config/db');

const sendRequest = async (req, res) => {
  try {
    const { senderId, receiverUsername } = req.body;
    const receiver = await prisma.user.findUnique({ where: { username: receiverUsername } });
    if (!receiver) return res.status(404).json({ success: false, error: '유저 없음!' });
    if (receiver.id === senderId) return res.status(400).json({ success: false, error: '자기 자신한테는 못 보내!' });

    const existing = await prisma.friendRequest.findFirst({
      where: { senderId, receiverId: receiver.id }
    });
    if (existing) return res.status(400).json({ success: false, error: '이미 요청 보냈어!' });

    const request = await prisma.friendRequest.create({
      data: { senderId, receiverId: receiver.id }
    });
    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { sender: { select: { id: true, username: true } } }
    });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const respondRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status }
    });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } }
      }
    });
    const friends = requests.map(r => r.senderId === userId ? r.receiver : r.sender);
    res.json({ success: true, data: friends });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { sendRequest, getRequests, respondRequest, getFriends };