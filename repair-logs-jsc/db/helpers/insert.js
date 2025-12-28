/**
 * Insert a new row into a table.
 *
 * @param {string} tableName - Name of the table to insert into.
 * @param {Object} data - An object with column names as keys and values to insert.
 * @param {import('pg').Pool} db - pg database instance (Pool or Client).
 * @returns {Promise<Object>} The inserted row.
 *
 * @example
 * const newLog = await insert('logs', {
 *   log_date: '2025-12-28',
 *   order_num: 123,
 *   vehicle_code: 'ABC123'
 * }, db);
 */
async function insert(tableName, data, db) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`);

  const query = `INSERT INTO public.${tableName} (${keys.join(
    ", "
  )}) VALUES (${placeholders.join(", ")}) RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = { insert };
