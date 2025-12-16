const db = require("../pool");

async function getUser(username) {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return rows[0];
  } catch {
    throw new Error("Internal Server Error");
  }
}

module.exports = {
  getUser,
};
