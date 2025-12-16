const db = require("../db/queries/stories.queries");
const redisCache = require("../db/redisCache");
const postDB = require("../db/queries/post.queries");

// Create
async function createStory(req, res) {
  const { type } = req.params;
  const { count, title, year, summary, special } = req.body;
  const cacheKey = `stories:${type}`;

  try {
    await db.createStory({ count, type, title, year, summary, special });

    const redis_cache = await redisCache.get(cacheKey);
    if (redis_cache) await redisCache.del(cacheKey);

    return res.status(201).json({ message: "Story created successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Read
async function getStoriesForType(req, res) {
  const { type } = req.params;
  const cacheKey = `stories:${type}`;

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
    const stories = await db.getStoriesForType(type);

    // Store data in redis cache
    await redisCache.set(cacheKey, JSON.stringify(stories));

    return res.status(200).json(stories);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update
async function updateStoryWithType(req, res) {
  const { type: url_type, storyid } = req.params;
  const { count, type, title, year, summary, special } = req.body;

  const cacheKey = `stories:${url_type}`;
  const cacheKey2 = `stories:${type}`;

  try {
    // Remove from Postgres
    await db.updateStoryByID(storyid, {
      count,
      type,
      title,
      year,
      summary,
      special,
    });

    // 2. Remove from redis cache if exists
    const redis_1_cache = await redisCache.get(cacheKey);
    if (redis_1_cache) await redisCache.del(cacheKey);

    const redis_2_cache = await redisCache.get(cacheKey2);
    if (redis_2_cache && cacheKey !== cacheKey2)
      await redisCache.del(cacheKey2);

    return res.status(204).json({ message: "Updated story successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete
async function deleteStoryByID(req, res) {
  const { type, storyid } = req.params;
  const cacheKey = `stories:${type}`;
  const postsCacheKey = `posts:${type}:${storyid}`;
  try {
    // Remove from Postgres
    await db.deleteStoryByID(storyid);

    // Remove story posts from DB
    await postDB.deletePostsAfterStoryDeleted(type, storyid);

    // Remove from redis cache if exists
    const redis_story_cache = await redisCache.get(cacheKey);
    if (redis_story_cache) await redisCache.del(cacheKey);

    const redis_posts_cache = await redisCache.get(postsCacheKey);
    if (redis_posts_cache) await redisCache.del(postsCacheKey);

    return res.status(200).json({ message: "Deleted story successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createStory,
  getStoriesForType,
  updateStoryWithType,
  deleteStoryByID,
};
