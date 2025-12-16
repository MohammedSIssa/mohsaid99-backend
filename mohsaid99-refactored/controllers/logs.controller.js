const db = require("../db/queries/logs.queries");
const redisCache = require("../db/redisCache");

// Create
async function addToLogs(req, res) {
  const cacheKey = "logs";
  const { visitedAt, os, url, username } = req.body;
  const details = `${os} - ${visitedAt}`;
  const data = { username, url, details };
  try {
    await db.addToLog(data);

    const redis_cache = await redisCache.get(cacheKey);
    if (redis_cache) await redisCache.del(cacheKey);

    return res.status(201).json({ message: "Added log successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Read
async function getLogs(req, res) {
  const cacheKey = "logs";

  // 2. Look for logs in redis cache
  const redis_logs = await redisCache.get(cacheKey);
  if (redis_logs) return res.status(200).json(JSON.parse(redis_logs));

  // 3. If not cached, fetch from Postgres
  try {
    const logs = await db.readLog();
    return res.status(200).json(logs);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { addToLogs, getLogs };
