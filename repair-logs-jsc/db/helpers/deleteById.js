async function deleteById(tableName, id, db) {
  const query = `DELETE FROM public.${tableName} WHERE id = $1`;
  await db.query(query, [id]);
}

module.exports = { deleteById };
