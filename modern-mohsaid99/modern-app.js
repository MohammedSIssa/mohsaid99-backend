const { Router } = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const modernMohsaid99Router = Router();

const loginRouter = require("./routes/login.route");
const postsRouter = require("./routes/posts.route");
const storiesRouter = require("./routes/stories.route");
const authRouter = require("./routes/auth.route");
const logsRouter = require("./routes/log.route");
const redisRouter = require("./routes/redis.route");

// Connect to redis only in production to avoid unnecessary overhead during development
let redisClient;

if (process.env.NODE_ENV !== "development") {
  const { createClient } = require("redis");

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => console.error("Redis error:", err));

  (async () => {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  })();
} else {
  redisClient = { get: async () => null, set: async () => {} };
}

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URI
      : process.env.LOCAL_DATABASE_URI,
});

modernMohsaid99Router.use((req, res, next) => {
  req.pool = pool;
  req.redisClient = redisClient;
  next();
});

modernMohsaid99Router.get("/", (req, res) => {
  res.send("Modern Mohsaid99");
});

modernMohsaid99Router.use("/login", loginRouter);
modernMohsaid99Router.use("/posts", postsRouter);
modernMohsaid99Router.use("/stories", storiesRouter);
modernMohsaid99Router.use("/auth", authRouter);
modernMohsaid99Router.use("/log", logsRouter);
modernMohsaid99Router.use("/redis", redisRouter);

module.exports = modernMohsaid99Router;
