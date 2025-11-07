const db = require("../db");

async function getAllStoriesWithType(type) {
  const results = await db.query(
    `SELECT * FROM stories WHERE type = $1 ORDER BY "count"`,
    [type]
  );

  return results;
}

async function getStoriesByTypeAndCount(type, count) {
  const result = await db.query(
    "SELECT * FROM stories WHERE type = $1 AND count = $2",
    [type, count]
  );

  return result;
}

async function getPostsForStoryWithType(type, id) {
  if (type === "goal") {
    const results = await db.query(
      `SELECT * FROM posts WHERE storyid = $1 AND "type" = $2 ORDER BY id DESC`,
      [id, type]
    );
    return results;
  }

  const results = await db.query(
    `SELECT * FROM posts WHERE storyid = $1 AND "type" = $2 ORDER BY id`,
    [id, type]
  );
  return results;
}

async function createPostForStoryWithType(data) {
  const { title, body, storyId, images, type, special, secret } = data;
  await db.query(
    "INSERT INTO posts (title, body, storyid, images, type, special, secret) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [title, body, storyId, images, type, special, secret]
  );
}

async function updateStoryWithType(data) {
  const { title, summary, year, special, type, count } = data;
  await db.query(
    "UPDATE stories SET title = $1, summary = $2, year = $3, special = $4 WHERE type = $5 AND count = $6",
    [title, summary, year, special, type, count]
  );
}

// async function updatePostByID(id, data) {
//   const { title, body, storyid, images, type, special, secret } = data;
//   await db.query(
//     "UPDATE posts SET title = $1, body = $2, storyid = $3, images = $4, type = $5, special = $6, secret = $7, WHERE id = $8",
//     [title, body, storyid, images, type, id, special, secret]
//   );
// }

async function createStoryWithType(type, data) {
  const { title, summary, year, count, special } = data;
  await db.query(
    "INSERT INTO stories (title, summary, year, count, special, type) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, summary, year, count, special, type]
  );
}

module.exports = {
  getAllStoriesWithType,
  getStoriesByTypeAndCount,
  getPostsForStoryWithType,
  createPostForStoryWithType,
  updateStoryWithType,
  // updatePostByID,
  createStoryWithType,
};
