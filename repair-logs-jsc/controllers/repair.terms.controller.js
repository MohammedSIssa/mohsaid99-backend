const db = require("../db/pool");
const { findWhere } = require("../db/helpers/findWhere");
const {
  getColumnValuesWithFilter,
} = require("../db/helpers/getColumnValuesWithFilter");

const { getColumnValues } = require("../db/helpers/getColumnValues");
const { getAll } = require("../db/helpers/getAll");
const { insert } = require("../db/helpers/insert");
const { deleteById } = require("../db/helpers/deleteById");
const {
  getDistinctColumnValues,
} = require("../db/helpers/getDistinctColumnValues");

const tableName = "repair_terms";

async function getTermsByRepairType(req, res) {
  try {
    const terms = await getColumnValuesWithFilter(
      tableName,
      "repair_desc_ar",
      req.query,
      db
    );
    if (!terms || !terms.length) {
      return res.status(404).json({ message: "No terms were found" });
    }
    return res.status(200).json(terms);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getDataByTermNumber(req, res) {
  try {
    const data = await findWhere(tableName, req.query, db);
    if (!data)
      return res
        .status(404)
        .json({ message: "No data was found for term " + term });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllTermsNums(req, res) {
  try {
    const terms = await getColumnValues(tableName, "term_nums", db);
    if (!terms || !terms.length)
      return res.status(404).json({ message: "No terms were found." });

    return res.status(200).json(terms);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllRepairTermsData(req, res) {
  try {
    const data = await getAll(tableName, db);
    if (!data || !data.length)
      return res.status(404).json({ message: "No data was found!" });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createTerm(req, res) {
  try {
    await insert(tableName, req.body, db);

    return res.status(200).json({ message: "Created successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteTermById(req, res) {
  try {
    await deleteById(tableName, req.params.id, db);

    return res.status(204).json({ message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllRepairTypes(req, res) {
  try {
    // const data = await db.getAllRepairTypes();
    const data = await getDistinctColumnValues(tableName, "repair_type_ar", db);
    return res.status(200).json(data);
  } catch {
    return res.status(500).json("Internal Server Error");
  }
}

async function getDataByTermName(req, res) {
  try {
    const data = await findWhere("repair_terms", req.query, db);
    if (!data)
      return res.status(404).json({ message: "No term data was found" });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllTermNames(req, res) {
  try {
    const data = await getColumnValues(tableName, "repair_desc_ar", db);

    if (!data || !data.length)
      return res.status(404).json({ message: "No term names were found." });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getTermsByRepairType,
  getDataByTermNumber,
  getAllTermsNums,
  getAllRepairTermsData,
  createTerm,
  deleteTermById,
  getAllRepairTypes,
  getDataByTermName,
  getAllTermNames,
};
