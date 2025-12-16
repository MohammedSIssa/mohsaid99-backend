const db = require("../db/queries/post.queries");
const redisCache = require("../db/redisCache");

// Read
async function getPostsForStoryWithTypeAndID(req, res) {
  const { storyid, type } = req.params;
  const cacheKey = `posts:${type}:${storyid}`;

  // 2. Look for posts in redis cache
  try {
    const isRedisCached = await redisCache.get(cacheKey);
    if (isRedisCached) {
      return res.status(200).json(JSON.parse(isRedisCached));
    }
  } catch {
    console.log("Redis error");
  }

  // 3. If not found, fetch from Postgres
  try {
    const posts = await db.getPostsForStoryWithTypeAndID(type, storyid);
    if (!posts) return res.status(404).json({ message: "No posts found" });

    // Add to redis cache
    redisCache.set(cacheKey, JSON.stringify(posts));

    return res.status(200).json(posts);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create
async function addPostWithTypeAndID(req, res) {
  const { storyid, type } = req.params;
  const { title, body, images, special, secret } = req.body;

  const cacheKey = `posts:${type}:${storyid}`;

  try {
    await db.addPostWithTypeAndID({
      storyid,
      type,
      title,
      body,
      images,
      special,
      secret,
    });
    const redis_cache = await redisCache.get(cacheKey);
    if (redis_cache) await redisCache.del(cacheKey);

    return res.status(201).json({ message: "Post created successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update
async function updatePostWithTypeAndID(req, res) {
  const { storyid: url_storyid, type: url_type, postid } = req.params;
  const { title, body, images, storyid, type, special, secret } = req.body;
  const cacheKey = `posts:${type}:${storyid}`;
  const cacheKey2 = `posts:${url_type}:${url_storyid}`;
  try {
    await db.updatePostByID(postid, {
      title,
      body,
      images,
      storyid,
      type,
      special,
      secret,
    });

    // 2. Remove from redis cache
    const redis_1_cache = await redisCache.get(cacheKey);
    if (redis_1_cache) await redisCache.del(cacheKey);

    const redis_2_cache = await redisCache.get(cacheKey2);
    if (redis_2_cache) await redisCache.del(cacheKey2);

    return res.status(204).json({ message: "Post updated successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete
async function deletePostWithTypeAndID(req, res) {
  const { storyid, type, postid } = req.params;
  const cacheKey = `posts:${type}:${storyid}`;

  try {
    // Delete from Postgres
    await db.deletePostByID(postid);

    // Delete from redis
    const redis_cache = await redisCache.get(cacheKey);
    if (redis_cache) await redisCache.del(cacheKey);

    return res.status(200).json({ message: "Deleted post successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addPostWithTypeAndID,
  getPostsForStoryWithTypeAndID,
  updatePostWithTypeAndID,
  deletePostWithTypeAndID,
};
