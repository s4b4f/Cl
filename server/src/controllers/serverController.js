const prisma = require('../config/db');

const createServer = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, error: '서버 이름을 입력해줘!' });

    const server = await prisma.server.create({
      data: {
        name: name.trim(),
        members: { create: { userId, role: 'owner' } }
      }
    });
    res.status(201).json({ success: true, data: server });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getServers = async (req, res) => {
  try {
    const { userId } = req.params;
    const members = await prisma.member.findMany({
      where: { userId },
      include: { server: true }
    });
    const servers = members.map(m => m.server);
    res.json({ success: true, data: servers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const joinServer = async (req, res) => {
  try {
    const { userId, serverId } = req.body;
    const existing = await prisma.member.findFirst({ where: { userId, serverId } });
    if (existing) return res.status(400).json({ success: false, error: '이미 참가한 서버야!' });

    await prisma.member.create({ data: { userId, serverId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteServer = async (req, res) => {
  try {
    const { serverId, userId } = req.body;
    const member = await prisma.member.findFirst({ where: { serverId, userId, role: 'owner' } });
    if (!member) return res.status(403).json({ success: false, error: '권한 없어!' });

    await prisma.server.delete({ where: { id: serverId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getServerInfo = async (req, res) => {
  try {
    const { serverId } = req.params;
    const server = await prisma.server.findUnique({ where: { id: serverId } });
    if (!server) return res.status(404).json({ success: false, error: '서버 없음!' });
    res.json({ success: true, data: server });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createServer, getServers, joinServer, deleteServer, getServerInfo };