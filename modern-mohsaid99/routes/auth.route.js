// '/auth/verify'

const { Router } = require("express");
// const { verifyToken } = require("../middleware/auth.middleware");
const ensureAuth = require("../middleware/ensureAuth");

const authRouter = Router();

authRouter.get("/verify", ensureAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = authRouter;
