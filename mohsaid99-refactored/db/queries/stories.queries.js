const db = require("../pool");

// Create
async function createStory(data) {
  const { count, type, title, year, summary, special } = data;
  await db.query(
    "INSERT INTO stories (count, type, title, year, summary, special, seen) VALUES ($1, $2, $3, $4, $5, $6, false)",
    [count, type, title, year, summary, special]
  );
}

// Read
async function getStoriesForType(type) {
  const { rows } = await db.query(
    `SELECT * FROM stories WHERE type = $1 ORDER BY "count" DESC`,
    [type]
  );

  return rows;
}

// Update
async function updateStoryByID(id, data) {
  const { count, type, title, year, summary, special } = data;
  await db.query(
    "UPDATE stories SET count = $1, type = $2, title = $3, year = $4, summary = $5, special = $6 WHERE id = $7",
    [count, type, title, year, summary, special, id]
  );
}

// Delete
async function deleteStoryByID(id) {
  await db.query(`DELETE FROM stories WHERE "count" = $1`, [id]);
}

async function updateStorySeen(type, count) {
  await db.query(
    "UPDATE stories SET seen = true WHERE type = $1 AND count = $2",
    [type, count]
  );
}

async function updateStoryUnSeen(type, count) {
  await db.query(
    "UPDATE stories SET seen = false WHERE type = $1 AND count = $2",
    [type, count]
  );
}

module.exports = {
  createStory,
  getStoriesForType,
  updateStoryByID,
  deleteStoryByID,
  updateStorySeen,
  updateStoryUnSeen,
};
