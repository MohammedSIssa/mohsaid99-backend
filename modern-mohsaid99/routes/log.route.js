require("dotenv").config();
const { Router } = require("express");
const ensureAuth = require("../middleware/ensureAuth");
const ensureAdmin = require("../middleware/ensureAdmin");

const logsRouter = Router();

logsRouter.get("/", ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { rows } = await req.pool.query(
      "SELECT * FROM logs ORDER BY id DESC",
    );
    if ((process.env.NODE_ENV = "development")) {
      // get from postgres directly
      return res.status(200).json(rows);
    } else {
      const cacheKey = `logs`;
      const cachedLogs = await req.redisCache.get(cacheKey);
      if (cachedLogs) {
        return res.status(200).json(JSON.parse(cachedLogs));
      }
      return res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

logsRouter.post("/", async (req, res) => {
  const cacheKey = "logs";
  const { visitedAt, os, url, username } = req.body;
  const details = `${os} - ${visitedAt}`;
  try {
    await req.pool.query(
      "INSERT INTO logs (username, details, visited) VALUES ($1, $2, $3)",
      [username, details, url],
    );
    if (process.env.NODE_ENV === "development") {
      // dev, deal with psql directly
      return res.status(201).json({ message: "Added log successfully" });
    } else {
      // production, deal with redis cache here..
      const redis_cache = await req.redisCache.get(cacheKey);
      if (redis_cache) await req.redisCache.del(cacheKey);
    }
    return res.status(201).json({ message: "Added log successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = logsRouter;
