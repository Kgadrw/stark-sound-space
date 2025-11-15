const bcrypt = require("bcryptjs");
const AdminUser = require("../models/AdminUser");

const DEFAULT_USERNAME = "rwangabonel@123";
const DEFAULT_PASSWORD = "nel@123";

const ensureAdminUser = async () => {
  let user = await AdminUser.findOne();
  if (!user) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    user = await AdminUser.create({ username: DEFAULT_USERNAME, passwordHash });
  }
  return user;
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    const user = await ensureAdminUser();
    if (username !== user.username) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ success: true, username: user.username });
  } catch (error) {
    next(error);
  }
};

const updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, username, password } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: "currentPassword is required" });
    }
    const user = await ensureAdminUser();
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({ success: true, username: user.username });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  updateCredentials,
};


