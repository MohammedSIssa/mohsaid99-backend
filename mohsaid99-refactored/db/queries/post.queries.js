const db = require("../pool");

// Create
async function addPostWithTypeAndID(data) {
  const { storyid, type, title, body, images, special, secret } = data;
  await db.query(
    "INSERT INTO posts (storyid, type, title, body, images, special, secret) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [storyid, type, title, body, images, special, secret]
  );
}

// Read
async function getPostsForStoryWithTypeAndID(type, id) {
  const { rows } = await db.query(
    "SELECT * FROM posts WHERE storyid = $1 AND type = $2 ORDER BY id DESC",
    [id, type]
  );

  return rows;
}

// Update
async function updatePostByID(postid, data) {
  const { title, body, images, storyid, type, special, secret } = data;
  await db.query(
    "UPDATE posts SET title = $1, body = $2, images = $3, storyid = $4, type = $5, special = $6, secret = $7 WHERE id = $8",
    [title, body, images, storyid, type, special, secret, postid]
  );
}

// Delete
async function deletePostByID(postid) {
  await db.query("DELETE FROM posts WHERE id = $1", [postid]);
}

async function deletePostsAfterStoryDeleted(type, storyid) {
  await db.query(`DELETE FROM posts WHERE type = $1 AND storyid = $2`, [
    type,
    storyid,
  ]);
}

module.exports = {
  addPostWithTypeAndID,
  getPostsForStoryWithTypeAndID,
  updatePostByID,
  deletePostByID,
  deletePostsAfterStoryDeleted,
};
