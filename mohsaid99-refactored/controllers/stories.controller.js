const redisCache = require("../db/redisCache");
const orm = require("../db/queries/orm");
const TABLE_NAME = "stories";

// Create
async function createStory(req, res) {
  const { type, year } = req.query;
  const cacheKey = `stories:${type}:${year}`;

  try {
    const redis = await redisCache.get(cacheKey);
    if (redis) await redisCache.del(cacheKey);
  } catch (e) {
    console.error(e);
  }

  try {
    await orm.create(TABLE_NAME, req.body);
    return res.status(201).json({ message: "Story created successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Read
async function getStories(req, res) {
  const { type, year } = req.query;
  const cacheKey = `stories:${type}:${year}`;

  // 2. Look for redis cache
  try {
    const redis_cache = await redisCache.get(cacheKey);
    if (redis_cache) {
      return res.status(200).json(JSON.parse(redis_cache));
    }
  } catch {
    console.log("Redis Error");
  }

  // 3. Get from Postgres
  try {
    const stories = await orm.findWhere(TABLE_NAME, req.query, {
      orderBy: "count DESC",
    });
    // Store data in redis cache
    await redisCache.set(cacheKey, JSON.stringify(stories));
    return res.status(200).json(stories);
  } catch {
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Update
async function updateStoryWithType(req, res) {
  const { fromyear, fromtype, storyid: id } = req.query;
  const { type, year } = req.body;
  const cacheKey1 = `stories:${fromtype}:${fromyear}`;
  const cacheKey2 = `stories:${type}:${year}`;

  try {
    await redisCache.del(cacheKey1);
    await redisCache.del(cacheKey2);
  } catch (e) {
    console.log("Redis error");
    console.error(e);
  }

  try {
    await orm.update(TABLE_NAME, id, req.body);
    return res.status(201).json({ message: "Updated successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Delete
async function deleteStoryByID(req, res) {
  const { id, count, type, year } = req.query;

  const cacheKey1 = `stories:${type}:${year}`;
  const cacheKey2 = `posts:${type}:${count}`;

  try {
    await redisCache.del(cacheKey1);
    await redisCache.del(cacheKey2);
  } catch (e) {
    console.error(e);
    console.log("Redis Error");
  }

  try {
    await orm.deleteById(TABLE_NAME, id);
    await orm.deleteWhere("posts", { type, storyid: count });
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

module.exports = {
  createStory,
  getStories,
  updateStoryWithType,
  deleteStoryByID,
};
