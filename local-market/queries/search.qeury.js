const db = require("../db");

async function searchProduct(query) {
  const { rows } = await db.query(
    "SELECT * FROM products WHERE title ILIKE $1",
    [`%${query}%`]
  );
  return rows;
}

module.exports = {
  searchProduct,
};
