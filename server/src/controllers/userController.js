const prisma = require('../config/db');

const changeUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;

    if (!newUsername || !newUsername.trim()) {
      return res.status(400).json({ success: false, error: '닉네임을 입력해줘!' });
    }
    if (newUsername.trim().length < 2) {
      return res.status(400).json({ success: false, error: '닉네임은 2글자 이상이어야 해!' });
    }
    if (newUsername.trim().length > 20) {
      return res.status(400).json({ success: false, error: '닉네임은 20글자 이하여야 해!' });
    }

    let tag;
    let tagExists = true;
    while (tagExists) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      tag = '';
      for (let i = 0; i < 4; i++) {
        tag += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const found = await prisma.user.findUnique({ where: { tag: `${newUsername.trim()}#${tag}` } });
      tagExists = !!found;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername.trim(), tag: `${newUsername.trim()}#${tag}` }
    });

    res.json({ success: true, data: { username: user.username, tag: user.tag } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { changeUsername };