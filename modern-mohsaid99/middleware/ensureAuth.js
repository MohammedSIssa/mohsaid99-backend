const jwt = require("jsonwebtoken");
require("dotenv").config();

const ensureAuth = (req, res, next) => {
  // if (process.env.NODE_ENV === "development") return next();

  const token = req.headers.authorization?.split(" ")[1];

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
