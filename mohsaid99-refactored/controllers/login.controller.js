const db = require("../db/queries/login.queries");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    // 1. Find the user..
    const user = await db.getUser(username);
    if (!user) return res.status(404).json({ message: "Invalid Credentials" });

    // 2. Compare password..
    const matchesPassword = await bcrypt.compare(password, user.password);
    if (matchesPassword) {
      return res
        .status(200)
        .json({
          id: user.id,
          username: user.username,
          role: user.role,
          apikey: user.apikey,
        });
    }
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { login };
