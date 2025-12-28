/**
 * Find rows in a table that match the given conditions.
 *
 * @param {string} tableName - The name of the table to query.
 * @param {Object} conditions - An object representing column-value pairs to filter by.
 * @param {import('pg').Pool} db - The PostgreSQL database instance (Pool or Client).
 * @returns {Promise<Object[]>} An array of rows matching the conditions.
 *
 * @example
 * // Find logs with a specific vehicle code and order number
 * const logs = await findWhere('logs', { vehicle_code: 'ABC123', order_num: 10 }, db);
 * console.log(logs);
 *
 * @example
 * // Find users with a specific role
 * const admins = await findWhere('users', req.query, db);
 */
async function findWhere(tableName, conditions, db) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const where = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");

  const query = `SELECT * FROM public.${tableName} WHERE ${where}`;
  const result = await db.query(query, values);

  if (result.rows.length === 1) return result.rows[0];
  return result.rows;
}

module.exports = { findWhere };
