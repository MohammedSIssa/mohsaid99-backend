require("dotenv").config();
const ensureAuth = require("../middleware/ensureAuth");
const ensureAdmin = require("../middleware/ensureAdmin");

const storiesRouter = require("express").Router();

storiesRouter.get("/", ensureAuth, async (req, res) => {
  const { type, year } = req.query;
  try {
    if (process.env.NODE_ENV === "development") {
      // deal with postgres directly
      const stories = await req.pool.query(
        `SELECT * FROM stories 
        WHERE "type" = $1 AND 
        ${
          type === "special" || type === "blog"
            ? "EXTRACT(YEAR FROM to_date(year, 'DD/MM/YYYY')) = $2"
            : "year = $2"
        } ORDER BY count DESC`,
        [type, year],
      );

      return res.status(200).json(stories.rows);
    } else {
      // deal with redis/postgres
      const cacheKey = `stories:${type}:${year}`;
      const cachedStories = await req.redisClient.get(cacheKey);
      if (cachedStories) return res.status(200).json(JSON.parse(cachedStories));
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

storiesRouter.post("/", ensureAuth, ensureAdmin, async (req, res) => {
  const { title, type, summary, count, special, year } = req.body;

  console.log({
    cacheKey: `stories:${type}:${type === "special" || type === "blog" ? year.split("/")[2] : year}`,
  });

  try {
    if (process.env.NODE_ENV === "development") {
      // deal with postgres directly
      const newStory = await req.pool.query(
        `INSERT INTO stories (title, type, summary, count, special, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, type, summary, count, special, year],
      );
      return res.status(201).json(newStory.rows[0]);
    } else {
      // deal with redis/postgres

      const cacheKey = `stories:${type}:${type === "special" || type === "blog" ? year.split("/")[2] : year}`;
      const newStory = await req.pool.query(
        `INSERT INTO stories (title, type, summary, count, special, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, type, summary, count, special, year],
      );
      await req.redisClient.del(cacheKey);
      return res.status(201).json(newStory.rows[0]);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

storiesRouter.put("/:id", ensureAuth, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, type, summary, count, special, year } = req.body;
  try {
    if (process.env.NODE_ENV === "development") {
      // deal with postgres directly
      const updatedStory = await req.pool.query(
        `UPDATE stories SET title = $1, summary = $2, count = $3, special = $4, year = $5, type = $6 WHERE id = $7 RETURNING *`,
        [title, summary, count, special, year, type, id],
      );
      return res.status(200).json(updatedStory.rows[0]);
    } else {
      // deal with redis/postgres
      const cacheKey = `stories:${type}:${year}`;
      const updatedStory = await req.pool.query(
        `UPDATE stories SET title = $1, summary = $2, count = $3, special = $4, year = $5, type = $6 WHERE id = $7 RETURNING *`,
        [title, summary, count, special, year, type, id],
      );
      const cacheKey2 = `stories:${updatedStory.rows[0].type}:${updatedStory.rows[0].year}`;
      await req.redisClient.del(cacheKey);
      await req.redisClient.del(cacheKey2);
      return res.status(200).json(updatedStory.rows[0]);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

storiesRouter.delete("/:id", ensureAuth, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  if (process.env.NODE_ENV === "development") {
    const deletedStory = await req.pool.query(
      "DELETE FROM stories WHERE id = $1 RETURNING *",
      [id],
    );
    return res.status(204).json(deletedStory.rows[0]);
  } else {
    const deletedStory = await req.pool.query(
      "DELETE FROM stories WHERE id = $1 RETURNING *",
      [id],
    );
    const cacheKey = `stories:${deletedStory.rows[0].type}:${deletedStory.rows[0].year}`;
    await req.redisClient.del(cacheKey);
    return res.status(200).json(deletedStory.rows[0]);
  }
});

module.exports = storiesRouter;
