const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

require("dotenv").config();

const db = require("./db");

//const allowedOrigins = [
//  process.env.LOCALHOST_ORIGIN,
//  process.env.GITHUB_PAGES_ORIGIN,
//  "https://dashboard.uptimerobot.com"
//];

const app = express();

//app.use(
//  cors({
//    origin: function (origin, callback) {
//      if (allowedOrigins.includes(origin)) {
//        callback(null, true);
//      } else {
//        callback(new Error("Not allowed by CORS"));
//      }
//    },
//  })
// );

app.use(cors("*"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const typeRouter = require("./routes/type.route");
const postRouter = require("./routes/post.route");
const storyRouter = require("./routes/story.route");

app.post("/login", async (req, res) => {
  // Find user in the database
  const { username, password } = req.body;
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = rows[0];
  if (!user) {
    return res.status(404).json({ error: "No user was found!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    // Return the user object to the front-end Context API
    return res.status(200).json(user);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/log", async (req, res) => {
  const { visitedAt, os, url, username } = req.body;

  const details = `${os} - ${visitedAt}`;

  try {
    await db.query(
      "INSERT INTO logs (username, details, visited) VALUES ($1, $2, $3)",
      [username, details, url]
    );

    return res.status(201).json({ message: "Added log successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/logs", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM logs ORDER BY id DESC");
    const { rows } = results;
    return res.status(200).json(rows);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Pulsing" });
});

app.use("/", storyRouter);
app.use("/", postRouter);
app.use("/", typeRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
