const { Router } = require("express");
const newMohsaid99 = Router();

const loginRouter = require("./routes/login.route");
const postsRouter = require("./routes/post.route");
const storiesRouter = require("./routes/stories.route");
const logsRouter = require("./routes/logs.route");

newMohsaid99.use("/stories", storiesRouter);
newMohsaid99.use("/posts", postsRouter);
newMohsaid99.use("/login", loginRouter);
newMohsaid99.use("/logs", logsRouter);

module.exports = newMohsaid99;
