const db = require("../db");

async function getPostById(id) {
  const results = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
  return results;
}

async function updatePostByID(id, data) {
  const { title, body, storyid, images, type, special, secret } = data;
  await db.query(
    "UPDATE posts SET title = $1, body = $2, storyid = $3, images = $4, type = $5, special = $6, secret = $7 WHERE id = $8",
    [title, body, storyid, images, type, special, secret, id]
  );
}

async function deletePostByID(id) {
    await db.query("DELETE FROM posts WHERE id = $1", [id])
}

module.exports = {
  getPostById,
  updatePostByID,
  deletePostByID,
};
