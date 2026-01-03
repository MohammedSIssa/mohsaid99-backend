const redisCache = require("../db/redisCache");
const orm = require("../db/queries/orm");
const TABLE_NAME = "posts";

// Read
async function getPosts(req, res) {
  const { type, storyid } = req.query;
  const cacheKey = `posts:${type}:${storyid}`;
  try {
    const redis = await redisCache.get(cacheKey);
    if (redis) return res.status(200).json(JSON.parse(redis));
  } catch (e) {
    console.error(e);
    console.log("Redis error");
  }

  try {
    const posts = await orm.findWhere(TABLE_NAME, req.query, {
      orderBy: "id DESC",
    });
    await redisCache.set(cacheKey, JSON.stringify(posts));
    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Create
async function createPost(req, res) {
  const { type, storyid } = req.query;
  const cacheKey = `posts:${type}:${storyid}`;

  try {
    await redisCache.del(cacheKey);
  } catch (e) {
    console.error(e);
    console.log("Redis Error");
  }

  try {
    await orm.create(TABLE_NAME, req.body);
    return res.status(201).json({ message: "Created posts successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Update
async function updatePostWithTypeAndID(req, res) {
  const { fromtype, fromcount, id } = req.query;
  const { type, storyid } = req.body;
  const cacheKey1 = `posts:${fromtype}:${fromcount}`;
  const cacheKey2 = `posts:${type}:${storyid}`;

  try {
    await redisCache.del(cacheKey1);
    await redisCache.del(cacheKey2);
  } catch (e) {
    console.error(e);
    console.log("Redis Error");
  }

  try {
    await orm.update(TABLE_NAME, id, req.body);
    return res.status(201).json({ message: "Update success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

// Delete
async function deletePostWithTypeAndID(req, res) {
  const { type, storyid, id } = req.query;
  const cacheKey = `posts:${type}:${storyid}`;

  try {
    await redisCache.del(cacheKey);
  } catch (e) {
    console.error(e);
  }

  try {
    await orm.deleteById(TABLE_NAME, id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error", e });
  }
}

module.exports = {
  createPost,
  getPosts,
  updatePostWithTypeAndID,
  deletePostWithTypeAndID,
};
