const jwt = require("jsonwebtoken");
require("dotenv").config();

const ensureAuth = (req, res, next) => {
  const token = req.cookies?.token;

  console.log("Received token:", token); // Debugging log

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = ensureAuth;
