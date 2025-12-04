const db = require("../queries/login.query");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { username, password } = req.body;
  const user = await db.findUser(username);

  if (!user) return res.status(404).json({ error: "User not found" });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return res.status(400).json({ error: "Invalid credentials" });

  return res.status(200).json(user);
}

module.exports = { login };
