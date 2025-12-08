const db = require("../queries/search.qeury");

async function searchProduct(req, res) {
  console.log(req.query);
  const { query } = req.query;
  try {
    const products = await db.searchProduct(query);
    if (products.length === 0)
      return res.status(404).json({ error: "No products were found" });

    return res.status(200).json(products);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  searchProduct,
};
