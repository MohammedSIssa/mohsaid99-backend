const db = require("../db/logs.query");

async function getLogs(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const api_key = authHeader && authHeader.split(" ")[1];
    if (!api_key)
      return res.status(401).json({ error: "Missing or Invalid API Key" });

    const logs = await db.getLogs();
    return res.status(200).json(logs);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addLog(req, res) {
  const { visitedAt, os, url, username } = req.body;
  const details = `${os} - ${visitedAt}`;
  const data = { username, url, details };

  try {
    await db.addLog(data);
    return res.status(201).json({ message: "Added log successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getLogs, addLog };
