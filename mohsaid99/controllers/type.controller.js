const db = require("../db/type.query");

const redisClient = require("../db/redisCacher");

async function getAllStoriesWithType(req, res) {
  const storyType = req.params.type + "";

  try {
    if (["week", "goal", "stat", "special", "blog"].includes(storyType)) {
      const cached = await redisClient.get(`stories:${storyType}`);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      const { rows } = await db.getAllStoriesWithType(storyType);
      await redisClient.set(`stories:${storyType}`, JSON.stringify(rows));
      return res.status(200).json(rows);
    }
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPostsForStoryWithType(req, res) {
  const storyId = Number(req.params.id);
  const type = req.params.type;
  try {
    const cached = await redisClient.get(`posts:${type}-${storyId}`);
    if (cached) {
      console.log("Posts cache hit");
      return res.status(200).json(JSON.parse(cached));
    }
    const results = await db.getPostsForStoryWithType(type, storyId);
    const { rows } = results;

    await redisClient.set(`posts:${type}-${storyId}`, JSON.stringify(rows));
    return res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function createPostForStoryWithType(req, res) {
  const storyId = req.params.id;
  const data = {
    title: req.body.title,
    body: req.body.body,
    storyId,
    images: req.body.images,
    type: req.body.type,
    secret: req.body.secret,
    special: req.body.special,
  };
  try {
    await db.createPostForStoryWithType(data);
    const cached = await redisClient.get(`posts:${data.type}-${storyId}`);
    if (cached) await redisClient.del(`posts:${data.type}-${storyId}`);
    console.log("Added post for", req.body.type, storyId);
    const createdPost = await db.getCreatedPost();
    res.status(201).json(createdPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function updateStoryWithType(req, res) {
  if (req.query.count) {
    const { title, summary, year, special, type, count } = req.body;
    const data = { title, summary, year, special, type, count };
    try {
      await db.updateStoryWithType(data);

      const cached = await redisClient.get(`stories:${type}`);
      if (cached) await redisClient.del(`stories:${type}`);

      return res.status(204).json({ message: "Successfully Edited Story" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.status(200).json({ message: "Ok" });
}

async function createStoryWithType(req, res) {
  const { type } = req.params;

  const data = {
    title: req.body.title,
    summary: req.body.summary,
    special: req.body.special,
    year: req.body.year,
    count: req.body.count,
  };

  try {
    await db.createStoryWithType(type, data);
    const cached = await redisClient.get(`stories:${type}`);
    if (cached) await redisClient.del(`stories:${type}`);

    const latestCached = await redisClient.get(`stories:${type}:latest`);
    if (latestCached) await redisClient.del(`stories:${type}:latest`);
    res.status(201).json({ message: "Added story successfully!" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllStoriesWithType,
  getPostsForStoryWithType,
  createPostForStoryWithType,
  updateStoryWithType,
  createStoryWithType,
};
