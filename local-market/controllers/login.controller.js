const bcrypt = require("bcrypt");
const db = require("../queries/users.query");

async function login(req, res) {
  const { username, password } = req.body;
  const user = await db.findUser(username);
  if (!user) return res.status(400).json({ error: "Invalid Credentials" });

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch)
    return res.status(400).json({ error: "Invalid Credentials" });

  return res.status(200).json(user);
}

module.exports = {
  login,
};
