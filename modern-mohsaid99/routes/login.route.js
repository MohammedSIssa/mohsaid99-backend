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

  const token = jwt.sign({ user: user.rows[0] }, process.env.SECRET_KEY, {
    expiresIn: "365d",
  });

  const userData = {
    id: user.rows[0].id,
    username: user.rows[0].username,
    role: user.rows[0].role,
  };

  res.cookie("token", token, {
    httpOnly: true, // prevents JS from reading the cookie
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in ms
    path: "/", // cookie is valid for the entire site
    sameSite: "lax",
  });

  console.log({
    httpOnly: true, // prevents JS from reading the cookie
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in ms
    path: "/", // cookie is valid for the entire site
    sameSite: "lax",
  });

  console.log("Set cookies.");

  return res.status(200).json(userData);
});

module.exports = loginRoute;
