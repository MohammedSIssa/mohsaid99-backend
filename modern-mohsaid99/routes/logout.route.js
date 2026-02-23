const logoutRoute = require("express").Router();

logoutRoute.get("/", (req, res) => {
  // Clear the cookie named "token"
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
});

module.exports = logoutRoute;
