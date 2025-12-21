const db = require("../db/queries/repair.terms.query");

async function getTermsByRepairType(req, res) {
  const { type } = req.params;
  try {
    const terms = await db.getTermsByRepairType(type);
    if (!terms || !terms.length) {
      return res.status(404).json({ message: "No terms were found" });
    }
    return res.status(200).json(terms);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getDataByTermNumber(req, res) {
  const { term } = req.params;
  try {
    const data = await db.getDataByTermNumber(term);
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
    const terms = await db.getAllTermsNums();
    if (!terms || !terms.length)
      return res.status(404).json({ message: "No terms were found." });

    return res.status(200).json(terms);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllRepairTermsData(req, res) {
  try {
    const data = await db.getAllRepairTermsData();
    if (!data || !data.length)
      return res.status(404).json({ message: "No data was found!" });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createTerm(req, res) {
  try {
    await db.createTerm(req.body);

    return res.status(200).json({ message: "Created successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteTermById(req, res) {
  const { id } = req.params;
  try {
    await db.deleteTermById(id);

    return res.status(204).json({ message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllRepairTypes(req, res) {
  try {
    const data = await db.getAllRepairTypes();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json("Internal Server Error");
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
};
