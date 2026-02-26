// '/auth/verify'

const { Router } = require("express");
// const { verifyToken } = require("../middleware/auth.middleware");
const ensureAuth = require("../middleware/ensureAuth");

const authRouter = Router();

authRouter.get("/verify", ensureAuth, (req, res) => {
  const userData = {
    id: req.user.user.id,
    username: req.user.user.username,
    role: req.user.user.role,
  };
  res.json({ user: userData });
});

module.exports = authRouter;
