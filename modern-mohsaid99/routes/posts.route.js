require("dotenv").config();
const ensureAuth = require("../middleware/ensureAuth");
const ensureAdmin = require("../middleware/ensureAdmin");

const postsRouter = require("express").Router();

postsRouter.get("/", ensureAuth, async (req, res) => {
  try {
    const { type, count } = req.query;

    const getPosts = async () => {
      const posts = await req.pool.query(
        `SELECT * FROM posts WHERE type = $1 AND storyid = $2 ${type === "week" ? "ORDER BY iat DESC" : ""}`,
        [type, count],
      );

      return posts.rows;
    };

    if (process.env.NODE_ENV === "development") {
      // use postgres
      const posts = await getPosts();
      res.status(200).json(posts);
    } else {
      // use redis
      const cacheKey = `posts:${type}:${count}`;
      const cachedPosts = await req.redisClient.get(cacheKey);
      if (cachedPosts) {
        return res.status(200).json(JSON.parse(cachedPosts));
      }
      const posts = await getPosts();
      await req.redisClient.set(cacheKey, JSON.stringify(posts));
      res.status(200).json(posts);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

postsRouter.post("/", ensureAuth, ensureAdmin, async (req, res) => {
  const { title, body, type, storyid, special, secret, images, dir } = req.body;
  try {
    if (process.env.NODE_ENV === "development") {
      // direct postgres
      const newPost = await req.pool.query(
        `INSERT INTO posts 
        (title, body, type, storyid, special, secret, images, dir) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [title, body, type, storyid, special, secret, images, dir],
      );
      return res.status(201).json(newPost);
    } else {
      // deal with redis
      const cacheKey = `posts:${type}:${storyid}`;
      const newPost = await req.pool.query(
        `INSERT INTO posts 
        (title, body, type, storyid, special, secret, images, dir) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [title, body, type, storyid, special, secret, images, dir],
      );
      await req.redisClient.del(cacheKey);
      return res.status(201).json(newPost);
    }
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

postsRouter.put("/:id", ensureAuth, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, body, type, storyid, special, secret, images, dir } = req.body;
  try {
    if (process.env.NODE_ENV === "development") {
      // direct postgres
      const updatedPost = await req.pool.query(
        `UPDATE posts SET 
        title = $1, body = $2, type = $3, storyid = $4, 
        special = $5, secret = $6, images = $7, dir = $8
        WHERE id = $9 RETURNING *`,
        [title, body, type, storyid, special, secret, images, dir, id],
      );
      return res.status(200).json(updatedPost);
    } else {
      // deal with redis
      const cacheKey = `posts:${type}:${storyid}`;
      const updatedPost = await req.pool.query(
        `UPDATE posts SET 
        title = $1, body = $2, type = $3, storyid = $4, 
        special = $5, secret = $6, images = $7, dir = $8
        WHERE id = $9 RETURNING *`,
        [title, body, type, storyid, special, secret, images, dir, id],
      );
      const cacheKey2 = `posts:${updatedPost.rows[0].type}:${updatedPost.rows[0].storyid}`;
      await req.redisClient.del(cacheKey);
      await req.redisClient.del(cacheKey2);
      return res.status(200).json(updatedPost);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

postsRouter.delete("/:id", ensureAuth, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (process.env.NODE_ENV === "development") {
      // direct postgres
      await req.pool.query("DELETE FROM posts WHERE id = $1", [id]);
      return res.status(204).send();
    } else {
      // deal with redis
      const postToDelete = await req.pool.query(
        "SELECT * FROM posts WHERE id = $1",
        [id],
      );
      if (postToDelete.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      const cacheKey = `posts:${postToDelete.rows[0].type}:${postToDelete.rows[0].storyid}`;
      await req.pool.query("DELETE FROM posts WHERE id = $1", [id]);
      await req.redisClient.del(cacheKey);
      return res.status(204).send();
    }
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = postsRouter;
