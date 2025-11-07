const db = require("../db/login.query");
const bcrypt = require("bcrypt");

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await db.getUser(username);
  if (!user) {
    return res.status(404).json({ error: "No user was found!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    // Return the user object to the front-end Context API
    return res.status(200).json(user);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { loginUser };
