const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginRoute = require("express").Router();

loginRoute.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  const user = await req.pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (!user || user.rows.length === 0)
    return res.status(404).json({ message: "No user was found" });

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword)
    return res.status(401).json({ message: "Incorrect password" });

  console.log("SECRET KEY:", process.env.SECRET_KEY);

  const token = jwt.sign({ user: user.rows[0] }, process.env.SECRET_KEY, {
    expiresIn: "365d",
  });

  console.log("Generated JWT:", token);

  res.json({
    token,
    user: user.rows[0],
  });
});

module.exports = loginRoute;
