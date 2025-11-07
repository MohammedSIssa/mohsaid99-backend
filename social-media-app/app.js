const express = require("express");
const { Router } = express;
const socialMediaRouter = Router();

const userRouter = require("./routes/user.route");
socialMediaRouter.use("/users", userRouter);

module.exports = socialMediaRouter;
