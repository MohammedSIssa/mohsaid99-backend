/**
 * Get distinct values of a specific column from a table.
 *
 * @param {string} tableName - The table to query.
 * @param {string} columnName - The column to get distinct values from.
 * @param {import('pg').Pool} db - PostgreSQL database instance (Pool or Client).
 * @returns {Promise<Array>} An array of distinct values from the specified column.
 *
 * @example
 * const repairTypes = await getDistinctColumnValues('repair_terms', 'repair_type_ar', db);
 * const vehicleCodes = await getDistinctColumnValues('vehicles_data', 'vehicle_code', db);
 */
async function getDistinctColumnValues(tableName, columnName, db) {
  const query = `SELECT DISTINCT ${columnName} FROM ${tableName}`;
  const { rows } = await db.query(query);

  return rows.map((row) => row[columnName]);
}

module.exports = { getDistinctColumnValues };
