const db = require("../pool");

async function addToLog(data) {
  const { username, url, details } = data;
  await db.query(
    "INSERT INTO logs (username, url, details) VALUES ($1, $2, $3)",
    [username, url, details]
  );
}

async function readLog() {
  const { rows } = await db.query("SELECT * FROM logs ORDER BY id DESC");
  return rows;
}

module.exports = { addToLog, readLog };
