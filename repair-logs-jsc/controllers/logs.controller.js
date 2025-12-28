const db = require("../db/pool");
const { update } = require("../db/helpers/update");
const { getById } = require("../db/helpers/getById");
const { getAll } = require("../db/helpers/getAll");
const { insert } = require("../db/helpers/insert");
const { deleteById } = require("../db/helpers/deleteById");

const tableName = "logs";

async function getLogs(req, res) {
  try {
    const logs = await getAll(tableName, db);

    if (!logs || !logs.length)
      return res.status(404).json({ message: "No logs were found!" });

    return res.status(200).json(logs);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getLogById(req, res) {
  try {
    const log = await getById(tableName, req.params.id, db);
    if (!log) return res.status(404).json({ message: "No log was found!" });

    return res.status(200).json(log);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteLogById(req, res) {
  try {
    await deleteById(tableName, req.params.id, db);

    return res.status(204).json({ message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createLog(req, res) {
  try {
    await insert(tableName, req.body, db);

    return res.status(201).json({ message: "Created a log." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateLogById(req, res) {
  try {
    await update(tableName, req.params.id, req.body, db);

    return res.status(204).json({ message: "Updated successfully" });
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
  updateLogById,
};
