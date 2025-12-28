async function getById(tableName, id, db) {
  const query = `SELECT * FROM public.${tableName} WHERE id = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

module.exports = { getById };
