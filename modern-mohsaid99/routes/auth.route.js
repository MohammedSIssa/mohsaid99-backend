// '/auth/verify'

const { Router } = require("express");
const { verifyToken } = require("../middleware/auth.middleware");

const authRouter = Router();

authRouter.get("/verify", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = authRouter;
