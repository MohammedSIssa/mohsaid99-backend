require("dotenv").config();

const db = require("../db/post.query");

const redisClient = require("../db/redisCacher");

async function getPostById(req, res) {
  const { postId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    try {
      const results = await db.getPostById(postId);
      const { rows } = results;
      return res.status(200).json(rows[0]);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else return res.status(401).json({ error: "Unauthorized" });
}

async function updatePostByID(req, res) {
  const { postId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    const { title, body, storyid, images, type, special, secret } = req.body;
    const data = { title, body, storyid, images, type, special, secret };

    try {
      const { rows } = await db.getPostById(postId);
      const post = rows[0];

      const cached = await redisClient.get(
        `posts:${post.type}-${post.storyid}`
      );
      if (cached) {
        console.log("Removing from cache");
        await redisClient.del(`posts:${data.type}-${data.storyid}`);
      }

      await db.updatePostByID(postId, data);
      return res.status(204).json({ message: "Updated posts successfully" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else return res.status(401).json({ error: "Unauthorized" });
}

async function deletePostByID(req, res) {
  const { postId } = req.params;
  const api_key = req.query.api_key ?? null;
  if (api_key && api_key === process.env.API_KEY) {
    try {
      const { rows } = await db.getPostById(postId);
      const data = rows[0];

      const cached = await redisClient.get(
        `posts:${data.type}-${data.storyid}`
      );
      if (cached) {
        console.log("Removing from cache");
        await redisClient.del(`posts:${data.type}-${data.storyid}`);
      }

      await db.deletePostByID(postId);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else return res.status(401).json({ error: "Unauthorized" });
}

module.exports = {
  getPostById,
  updatePostByID,
  deletePostByID,
};
