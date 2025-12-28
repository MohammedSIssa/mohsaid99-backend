/**
 * Get values of a specific column from a table, optionally filtered by conditions.
 *
 * @param {string} tableName - The table to query.
 * @param {string} columnName - The column to retrieve values from.
 * @param {Object} [conditions] - Optional object of column-value pairs to filter by.
 * @param {import('pg').Pool} db - PostgreSQL database instance (Pool or Client).
 * @returns {Promise<Array>} An array of values from the specified column.
 *
 * @example
 * // Get all repair descriptions for a specific type
 * const descs = await getColumnValuesWithFilter(
 *   'repair_terms',
 *   'repair_desc_ar',
 *   { repair_type_ar: 'Engine' },
 *   db
 * );
 */
async function getColumnValuesWithFilter(
  tableName,
  columnName,
  conditions = {},
  db
) {
  const conditionKeys = Object.keys(conditions);
  const values = Object.values(conditions);

  let whereClause = "";
  if (conditionKeys.length > 0) {
    const clauses = conditionKeys.map((key, i) => `${key} = $${i + 1}`);
    whereClause = ` WHERE ${clauses.join(" AND ")}`;
  }

  const query = `SELECT ${columnName} FROM ${tableName}${whereClause}`;
  const { rows } = await db.query(query, values);

  return rows.map((row) => row[columnName]);
}

module.exports = { getColumnValuesWithFilter };
