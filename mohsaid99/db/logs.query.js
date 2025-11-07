const db = require("../db");

async function addLog(data) {
  const { username, details, url } = data;
  await db.query(
    "INSERT INTO logs (username, details, visited) VALUES ($1, $2, $3)",
    [username, details, url]
  );
}

async function getLogs() {
  const { rows } = await db.query("SELECT * FROM logs ORDER BY id DESC");
  return rows;
}

module.exports = { addLog, getLogs };
