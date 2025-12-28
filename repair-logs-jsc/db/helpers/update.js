/**
 * Update a row in a table by id.
 *
 * @param {string} tableName - Name of the table to update.
 * @param {number|string} id - ID of the row to update.
 * @param {Object} data - An object containing the fields to update.
 * @param {import('pg').Pool} db - pg database instance (Pool or Client).
 * @returns {Promise<void>} Resolves when the row is updated.
 *
 * @example
 * // Update a log
 * await update('logs', 5, { licence_number: 'XYZ987', notes: 'Fixed' }, db);
 */
async function update(tableName, id, data, db) {
  const keys = Object.keys(data);

  if (keys.length === 0) return;

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = keys.map((key) => data[key]);

  const query = `UPDATE public.${tableName} SET ${setClauses.join(
    ", "
  )} WHERE id = $${keys.length + 1}`;
  values.push(id);

  await db.query(query, values);
}

module.exports = { update };
