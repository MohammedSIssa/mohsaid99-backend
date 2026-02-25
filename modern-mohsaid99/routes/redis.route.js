const { Router } = require("express");
const ensureAuth = require("../middleware/ensureAuth");
const ensureAdmin = require("../middleware/ensureAdmin");

const redisRouter = Router();

// Get all keys.
redisRouter.get("/", ensureAuth, async (req, res) => {
  try {
    const keys = [];

    for await (const key of req.redisClient.scanIterator()) {
      keys.push(key);
    }

    return res.status(200).json(keys);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a specific key.
redisRouter.get("/:key", ensureAuth, async (req, res) => {
  const { key } = req.params;
  try {
    const cache = await req.redisClient.get(key);
    if (cache) return res.status(200).json(JSON.parse(cache));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a key.
redisRouter.delete("/:key", ensureAuth, ensureAdmin, async (req, res) => {
  const { key } = req.params;
  try {
    await req.redisClient.del(key);
    return res.status(200).json({ message: "Deleted Successfully." });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = redisRouter;
