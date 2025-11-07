const express = require("express");
const { Router } = express;
const mohsaidRouter = Router();

// mohsaid99 website routes
const typeRouter = require("./routes/type.route");
const postRouter = require("./routes/post.route");
const storyRouter = require("./routes/story.route");
const loginRouter = require("./routes/login.route");
const logsRouter = require("./routes/logs.route");

mohsaidRouter.use("/", loginRouter);
mohsaidRouter.use("/", storyRouter);
mohsaidRouter.use("/", postRouter);
mohsaidRouter.use("/", logsRouter);

// NOTE TO SELF: always keep tyoe router at the bottom of mohsaid99 routes
mohsaidRouter.use("/", typeRouter);

module.exports = mohsaidRouter;
