const db = require("../queries/register.query");
const users_db = require("../queries/user.query");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { username, password } = req.body;

  try {
    const user = await users_db.findUser(username);
    if (user) return res.status(400).json({ error: "Username is taken" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const hashed_password = await bcrypt.hash(password, 10);

  const data = { username, password: hashed_password };
  try {
    await db.register(data);
    return res.status(201).json({ message: "Registered user." });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { register };
