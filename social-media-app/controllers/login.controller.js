const db = require("../queries/user.query");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await db.findUser(username);
    if (!user) return res.status(404).json({ error: "No user was found" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.status(200).json(user);
    } else {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { login };
