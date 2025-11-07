const db = require("../db");

async function getStoryById(id) {
  const results = await db.query("SELECT * FROM stories WHERE id = $1", [id]);

  return results;
}

async function updateStoryByID(id, data) {
  const { title, summary, year, type, count, special } = data;
  await db.query(
    `UPDATE stories SET title = $1, summary = $2, year = $3, "type" = $4, "count" = $5, special = $6 WHERE id = $7`,
    [title, summary, year, type, count, special, id]
  );
}

async function deleteStoryByID(id) {
  await db.query("DELETE FROM stories WHERE id = $1", [id]);
}

module.exports = {
  getStoryById,
  updateStoryByID,
  deleteStoryByID,
};
