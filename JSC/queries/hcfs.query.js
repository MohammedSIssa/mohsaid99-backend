const db = require("../db");

async function getAllPartnerTypes() {
  const { rows } = await db.query("SELECT * FROM partner_types");
  return rows;
}

async function getPartnerNames(partner_type_id) {
  const { rows } = await db.query(
    "SELECT * FROM partner_names WHERE partner_type_id = $1",
    [partner_type_id]
  );

  return rows;
}

module.exports = { getAllPartnerTypes, getPartnerNames };
