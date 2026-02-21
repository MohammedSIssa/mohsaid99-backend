require("dotenv").config();

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

module.exports = redisClient;
