const db = require("../queries/user.query");

// const redisClient = require("../db/redis");

// Get all users in the webiste
async function getAllUsers(req, res) {
  try {
    const users = await db.getAllUsers();
    return res.status(200).json(users);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get the accounts that follow this userId
async function getFollowers(req, res) {
  const userId = req.params.id;
  try {
    const followers = await db.getFollowers(userId);

    return res
      .status(200)
      .json({ userId, followers_count: followers.length, followers });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get the accounts that userId is following
async function getFollowing(req, res) {
  const userId = req.params.id;
  try {
    const following = await db.getFollowing(userId);
    return res
      .status(200)
      .json({ userId, following_count: following.length, following });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function followAccount(req, res) {
  const follower_id = req.params.id;
  const followed_id = req.params.target;

  console.log(follower_id, "should now follow", followed_id);

  try {
    await db.followUser(follower_id, followed_id);
    return res.status(201).json({ message: "Followed Successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function unfollowAccount(req, res) {
  const follower_id = req.params.id;
  const followed_id = req.params.target;
  console.log(follower_id, "should now unfollow", followed_id);

  try {
    await db.unfollowUser(follower_id, followed_id);
    return res.status(201).json({ message: "Unfollowed Successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  console.log("Get data for user ID", id);
  try {
    const user = await db.getUserById(id);
    const followers = await db.getFollowers(id);
    const following = await db.getFollowing(id);
    return res
      .status(200)
      .json({
        user,
        followers,
        followers_count: followers.length,
        following,
        following_count: following.length,
      });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllUsers,
  getFollowers,
  getFollowing,
  followAccount,
  unfollowAccount,
  getUserById,
};
