const db = require("../pool");

async function getTermsByRepairType(type) {
  const { rows } = await db.query(
    "SELECT term_num FROM repair_terms WHERE repair_type_ar = $1",
    [type]
  );
  if (rows.length) {
    return rows.map((row) => row.term_num);
  }
  return [];
}

async function getDataByTermNumber(term_num) {
  const { rows } = await db.query(
    "SELECT * FROM repair_terms WHERE term_num = $1",
    [term_num]
  );

  return rows[0];
}

async function getAllTermsNums() {
  const { rows } = await db.query("SELECT term_num FROM repair_terms");
  if (rows.length) return rows.map((row) => row.term_num);

  return [];
}

async function getAllRepairTypesAr() {
  const { rows } = await db.query("SELECT repair_type_ar FROM repair_terms");
  if (rows.length) return rows.map((row) => row.repair_type_ar);

  return [];
}

async function getAllRepairTermsData() {
  const { rows } = await db.query("SELECT * FROM repair_terms");

  return rows;
}

async function createTerm(data) {
  const {
    repair_type_ar,
    repair_type_en,
    repair_desc_ar,
    repair_desc_en,
    uom,
    qty,
    service_cost,
    term_num,
  } = data;

  await db.query(
    `INSERT INTO repair_terms (
    repair_type_ar,
    repair_type_en,
    repair_desc_ar,
    repair_desc_en,
    uom,
    qty,
    service_cost,
    term_num
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      repair_type_ar,
      repair_type_en,
      repair_desc_ar,
      repair_desc_en,
      uom,
      qty,
      service_cost,
      term_num,
    ]
  );
}

async function deleteTermById(id) {
  await db.query("DELETE FROM repair_terms WHERE id = $1", [id]);
}

async function getAllRepairTypes() {
  const { rows } = await db.query(
    "SELECT DISTINCT repair_type_ar FROM repair_terms"
  );
  if (rows.length) return [...rows.map((row) => row.repair_type_ar)];
}

module.exports = {
  getTermsByRepairType,
  getDataByTermNumber,
  getAllTermsNums,
  getAllRepairTermsData,
  getAllRepairTypesAr,
  createTerm,
  deleteTermById,
  getAllRepairTypes,
};
