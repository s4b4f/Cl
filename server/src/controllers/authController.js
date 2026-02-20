const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTag = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let tag = '';
  for (let i = 0; i < 4; i++) {
    tag += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tag;
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, error: '이미 존재하는 이메일이야!' });

    let tag;
    let tagExists = true;
    while (tagExists) {
      tag = generateTag();
      const found = await prisma.user.findUnique({ where: { tag: `${username}#${tag}` } });
      tagExists = !!found;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, tag: `${username}#${tag}`, email, password: hashed }
    });

    res.status(201).json({ success: true, data: { id: user.id, username: user.username, tag: user.tag, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, error: '유저 없음!' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, error: '비밀번호 틀림!' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, username: user.username, tag: user.tag, userId: user.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { register, login };