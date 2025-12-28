/**
 * Get all values of a specific column from a table.
 *
 * @param {string} tableName - The name of the table to query.
 * @param {string} columnName - The column to retrieve values from.
 * @param {import('pg').Pool} db - The PostgreSQL database instance (Pool or Client).
 * @returns {Promise<array>} An array of values from the specified column.
 *
 * @example
 * const vehicleCodes = await getColumnValues('vehicles_data', 'vehicle_code', db);
 */
async function getColumnValues(tableName, columnName, db) {
  const query = `SELECT ${columnName} FROM ${tableName}`;
  const { rows } = await db.query(query);

  if (rows.length) return rows.map((row) => row[columnName]);

  return [];
}

module.exports = { getColumnValues };
