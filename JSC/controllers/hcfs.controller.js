const db = require("../queries/hcfs.query");

async function getAllPartnerNames(req, res) {
  const { partner } = req.query;
  try {
    const partnerNames = await db.getPartnerNames(partner);
    if (partnerNames.length === 0)
      return res.status(404).json({ error: "No Partner Names Were Found!" });

    return res.status(200).json(partnerNames);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllPartnerTypes(req, res) {
  try {
    const partnerTypes = await db.getAllPartnerTypes();
    if (partnerTypes.length === 0)
      return res.status(404).json({ error: "No Partner Types Were Found!" });

    return res.status(200).json(partnerTypes);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllPartnerNames,
  getAllPartnerTypes,
};
