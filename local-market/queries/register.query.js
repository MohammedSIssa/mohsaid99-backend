const db = require("../db");

async function register(data) {
  console.log("FROM QUERY", data)
  const { username, password, location, role} = data;
  await db.query(
    "INSERT INTO users (username, password, location, role) VALUES ($1, $2, $3, $4)",
    [username, password, location, role]
  );
}

module.exports = { register };
