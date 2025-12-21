const db = require("../db/queries/logs.query");

async function getLogs(req, res) {
  try {
    const logs = await db.getLogs();

    if (!logs || !logs.length)
      return res.status(404).json({ message: "No logs were found!" });

    return res.status(200).json(logs);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getLogById(req, res) {
  const { id } = req.params;
  try {
    const log = await db.getLogById(id);
    if (!log) return res.status(404).json({ message: "No log was found!" });

    return res.status(200).json(log);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteLogById(req, res) {
  const { id } = req.params;
  try {
    await db.deleteLogById(id);

    return res.status(204).json({ message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createLog(req, res) {
  try {
    await db.createLog(req.body);

    return res.status(201).json({ message: "Created a log." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getLogs,
  getLogById,
  deleteLogById,
  createLog,
};
