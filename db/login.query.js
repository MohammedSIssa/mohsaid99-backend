const db = require("../db");

async function getUser(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return rows[0];
}

module.exports = { getUser };
