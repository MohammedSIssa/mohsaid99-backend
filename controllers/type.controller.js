const db = require("../db/type.query");

async function getAllStoriesWithType(req, res) {
  const storyType = req.params.type + "";
  if (req.query.count) {
    try {
      const count = Number(req.query.count);
      const result = await db.getStoriesByTypeAndCount(storyType, count);

      const { rows } = result;
      if (rows.length === 0) {
        return res.status(404).json({ error: "404 not found" });
      }
      return res.status(200).json(rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  try {
    if (["week", "goal", "stat", "special", "blog"].includes(storyType)) {
      const results = await db.getAllStoriesWithType(storyType);

      const { rows } = results;
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
    const results = await db.getPostsForStoryWithType(type, storyId);

    const { rows } = results;

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
    console.log("Added post for", req.body.type, storyId);
    res.status(201).json({ message: "Added post successfully!" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function updateStoryWithType(req, res) {
  if (req.query.count) {
    const { title, summary, year, special } = req.body;
    const data = { title, summary, year, special, type, count };
    try {
      await db.updateStoryWithType(data);

      return res.status(204).json({ message: "Successfully Edited Story" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.status(200).json({ message: "Ok" });
}

async function createStoryWithType(req, res) {
  const { type } = req.params;
  console.log(type);

  const data = {
    title: req.body.title,
    summary: req.body.summary,
    special: req.body.special,
    year: req.body.year,
    count: req.body.count,
  };

  try {
    await db.createStoryWithType(type, data);
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
