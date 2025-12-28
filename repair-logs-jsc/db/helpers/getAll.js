async function getAll(tableName, db) {
  const query = `SELECT * FROM public.${tableName}`;
  const result = await db.query(query);
  return result.rows;
}

module.exports = { getAll };
