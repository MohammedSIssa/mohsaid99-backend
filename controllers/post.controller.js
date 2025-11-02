const db = require("../db/post.query");

async function getPostById(req, res) {
  const { postId } = req.params;
  try {
    const results = await db.getPostById(postId);
    const { rows } = results;
    return res.status(200).json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updatePostByID(req, res) {
  const { postId } = req.params;
  const { title, body, storyid, images, type, special, secret } = req.body;
  const data = { title, body, storyid, images, type, special, secret };

  try {
    await db.updatePostByID(postId, data);
    return res.status(204).json({ message: "Updated posts successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePostByID(req, res) {
  const { postId } = req.params;
  try {
    await db.deletePostByID(postId);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getPostById,
  updatePostByID,
  deletePostByID,
};
