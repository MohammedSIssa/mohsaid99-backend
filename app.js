require("dotenv").config();

const cors = require("cors");

const express = require("express");
const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mohsaid99 website routes
const typeRouter = require("./routes/type.route");
const postRouter = require("./routes/post.route");
const storyRouter = require("./routes/story.route");
const loginRouter = require("./routes/login.route");
const logsRouter = require("./routes/logs.route");

// my social media app routes
const socialMediaRouter = require("./social-media-app/app");

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Pulsing" });
});

app.use("/mohsaid99", loginRouter);
app.use("/mohsaid99", storyRouter);
app.use("/mohsaid99", postRouter);
app.use("/mohsaid99", logsRouter);

// NOTE TO SELF: always keep tyoe router at the bottom of mohsaid99 routes
app.use("/mohsaid99", typeRouter);

app.use("/social-media-app", socialMediaRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
