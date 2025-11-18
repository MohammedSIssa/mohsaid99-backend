const db = require("../db/pool");

async function getAllUsers() {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
}

async function findUser(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}

async function followUser(userId, targetId) {
  await db.query(
    `INSERT INTO follows (follower_id, followed_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING;`,
    [userId, targetId]
  );
}

async function unfollowUser(userId, targetId) {
  await db.query(
    `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2;`,
    [userId, targetId]
  );
}

// Get the accounts that follow this userId
async function getFollowers(userId) {
  const query = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.followed_id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

// Get the accounts that userId is following
async function getFollowing(userId) {
  const query = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u ON f.followed_id = u.id
    WHERE f.follower_id = $1
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

async function getUserById(id) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

module.exports = {
  getAllUsers,
  findUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserById,
};
