require("dotenv").config();
const db = require("../db/story.query");

const redisClient = require("../db/redisCacher");

async function getStoryById(req, res) {
  const { storyId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    try {
      const results = await db.getStoryById(storyId);
      const { rows } = results;

      if (rows.length === 0) {
        return res.status(404).json({ error: "Story was not found" });
      }

      return res.status(200).json(rows[0]);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function updateStoryByID(req, res) {
  const { storyId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    const data = {
      title: req.body.title,
      summary: req.body.summary,
      type: req.body.type,
      count: req.body.count,
      year: req.body.year,
      special: req.body.special,
    };
    try {
      await db.updateStoryByID(storyId, data);
      return res.status(201).json({ message: "Updated story successfully" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function deleteStoryByID(req, res) {
  const { storyId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    try {
      const results = await db.getStoryById(storyId);
      const { rows } = results;

      const story = rows[0];

      const cached = await redisClient.get(`stories:${story.type}`);
      if (cached) {
        console.log("Removing from cache");
        await redisClient.del(`stories:${story.type}`);
        await redisClient.del(`posts:${story.type}-${story.count}`);
      }
      await db.deleteStoryByID(storyId);
      return res
        .status(200)
        .json({ message: "Story was deleted successfully" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = {
  getStoryById,
  updateStoryByID,
  deleteStoryByID,
};
