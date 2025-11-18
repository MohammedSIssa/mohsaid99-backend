const express = require("express");
const { Router } = express;
const socialMediaRouter = Router();

const userRouter = require("./routes/user.route");
const loginRouter = require("./routes/login.route");
const registerRouter = require("./routes/register.route");

socialMediaRouter.get("/", (req, res) => res.send("Hello From Social Media App"));
socialMediaRouter.use("/login", loginRouter);
socialMediaRouter.use("/register", registerRouter);
socialMediaRouter.use("/users", userRouter);

module.exports = socialMediaRouter;
