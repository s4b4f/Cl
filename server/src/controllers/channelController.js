const prisma = require('../config/db');

const createChannel = async (req, res) => {
  try {
    const { name, serverId } = req.body;
    const channel = await prisma.channel.create({
      data: { name, serverId }
    });
    res.status(201).json({ success: true, data: channel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getChannels = async (req, res) => {
  try {
    const { serverId } = req.params;
    const channels = await prisma.channel.findMany({
      where: { serverId }
    });
    res.json({ success: true, data: channels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createChannel, getChannels };