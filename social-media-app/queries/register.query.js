const db = require("../db/pool");

async function register(data) {
  await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    data.username,
    data.password,
  ]);
}

module.exports = { register };
