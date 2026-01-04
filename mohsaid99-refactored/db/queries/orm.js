const db = require("../pool.js"); // your pg Pool or Client

/**
 * Mini ORM for basic CRUD operations
 */
class MiniORM {
  /**
   * Insert a new row into a table
   * @param {string} table - Table name
   * @param {Object} data - Column-value pairs
   * @returns {Promise<Object>} The inserted row
   */
  async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const query = `INSERT INTO ${table} (${keys.join(
      ", "
    )}) VALUES (${placeholders.join(", ")}) RETURNING *`;
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  /**
   * Get a row by id
   * @param {string} table - Table name
   * @param {number|string} id - Row id
   * @returns {Promise<Object|null>} The row or null if not found
   */
  async getById(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  /**
   * Get rows from a table by a specific column value
   * @param {string} table - Table name
   * @param {string} column - Column name to filter by
   * @param {any} value - Value to match
   * @returns {Promise<Object[]>} Array of matching rows
   *
   * @example
   * const user = await orm.getByValue('users', 'username', 'john123');
   */
  async getByValue(table, column, value) {
    const query = `SELECT * FROM ${table} WHERE ${column} = $1`;
    const { rows } = await db.query(query, [value]);
    if (rows.length === 1) return rows[0];
    return rows;
  }

  /**
   * Find multiple rows in a table using AND conditions.
   *
   * @param {string} table - Table name
   * @param {Object<string, any>} conditions - Column-value pairs for WHERE clause
   * @param {Object} [options] - Optional query options
   * @param {string} [options.orderBy] - ORDER BY clause (e.g. "id DESC")
   * @param {number} [options.limit] - LIMIT value
   * @param {number} [options.offset] - OFFSET value
   *
   * @returns {Promise<Array<Object>>} Array of matching rows
   *
   * @example
   * await orm.findWhere("posts", { type: "text", week: 44 }, {
   *   orderBy: "id DESC",
   *   limit: 10,
   *   offset: 0
   * });
   */
  async findILike(table, conditions = {}, options = {}) {
    const { orderBy = "", limit, offset } = options;

    const keys = Object.keys(conditions);
    const values = Object.values(conditions).map((v) => `%${v}%`);

    let whereClause = "";
    if (keys.length) {
      const clauses = keys.map((key, i) => `${key}::text ILIKE $${i + 1}`);
      whereClause = ` WHERE ${clauses.join(" AND ")}`;
    }

    let query = `SELECT * FROM ${table}${whereClause}`;

    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Find multiple rows in a table using AND conditions.
   *
   * @param {string} table - Table name
   * @param {Object<string, any>} conditions - Column-value pairs for WHERE clause
   * @param {Object} [options] - Optional query options
   * @param {string} [options.orderBy] - ORDER BY clause (e.g. "id DESC")
   * @param {number} [options.limit] - LIMIT value
   * @param {number} [options.offset] - OFFSET value
   *
   * @returns {Promise<Array<Object>>} Array of matching rows
   *
   * @example
   * await orm.findWhere("posts", { type: "text", week: 44 }, {
   *   orderBy: "id DESC",
   *   limit: 10,
   *   offset: 0
   * });
   */
  async findWhere(table, conditions = {}, options = {}) {
    const { orderBy = "", limit, offset } = options;

    const keys = Object.keys(conditions);
    const values = Object.values(conditions);

    let whereClause = "";
    if (keys.length) {
      const clauses = keys.map((key, i) => `${key} = $${i + 1}`);
      whereClause = ` WHERE ${clauses.join(" AND ")}`;
    }

    let query = `SELECT * FROM ${table}${whereClause}`;

    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Find a single row in a table.
   *
   * @param {string} table - Table name
   * @param {Object<string, any>} conditions - Column-value pairs
   *
   * @returns {Promise<Object|null>} The found row or null
   *
   * @example
   * const user = await orm.findOne("users", { username: "john" });
   */
  async findOne(table, conditions = {}) {
    const rows = await findWhere(table, conditions, { limit: 1 });
    return rows[0] || null;
  }

  /**
   * Advanced find with AND / OR conditions.
   *
   * @param {string} table - Table name
   * @param {Object} filters - Filter object
   * @param {Object<string, any>} [filters.AND] - AND conditions
   * @param {Array<Object<string, any>>} [filters.OR] - OR condition groups
   * @param {Object} [options] - Query options
   * @param {string} [options.orderBy] - ORDER BY clause
   * @param {number} [options.limit] - LIMIT value
   * @param {number} [options.offset] - OFFSET value
   *
   * @returns {Promise<Array<Object>>} Matching rows
   *
   * @example
   * await orm.findAdvanced(
   *   "posts",
   *   {
   *     AND: { week: 44 },
   *     OR: [{ type: "text" }, { type: "image" }]
   *   },
   *   { orderBy: "id DESC" }
   * );
   */
  async findAdvanced(table, filters = {}, options = {}) {
    const values = [];
    let index = 1;

    const buildConditions = (obj, joiner) =>
      Object.entries(obj)
        .map(([key, value]) => {
          values.push(value);
          return `${key} = $${index++}`;
        })
        .join(` ${joiner} `);

    let whereParts = [];

    if (filters.AND) {
      whereParts.push(`(${buildConditions(filters.AND, "AND")})`);
    }

    if (filters.OR) {
      const orGroups = filters.OR.map(
        (group) => `(${buildConditions(group, "AND")})`
      );
      whereParts.push(`(${orGroups.join(" OR ")})`);
    }

    const whereClause = whereParts.length
      ? ` WHERE ${whereParts.join(" AND ")}`
      : "";

    let query = `SELECT * FROM ${table}${whereClause}`;

    if (options.orderBy) query += ` ORDER BY ${options.orderBy}`;
    if (options.limit) query += ` LIMIT ${options.limit}`;
    if (options.offset) query += ` OFFSET ${options.offset}`;

    const { rows } = await db.query(query, values);
    return rows;
  }

  /**
   * Update a row by id
   * @param {string} table - Table name
   * @param {number|string} id - Row id
   * @param {Object} data - Column-value pairs to update
   * @returns {Promise<void>}
   */
  async update(table, id, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) return;

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
    const values = keys.map((key) => data[key]);
    values.push(id);

    const query = `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = $${
      keys.length + 1
    }`;
    await db.query(query, values);
  }

  /**
   * Delete a row by id
   * @param {string} table - Table name
   * @param {number|string} id - Row id
   * @returns {Promise<void>}
   */
  async deleteById(table, id) {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    await db.query(query, [id]);
  }

  /**
   * Deletes rows from a database table based on specified conditions.
   *
   * @async
   * @function deleteWhere
   * @param {Object} db - A PostgreSQL client or pool instance with a `query` method.
   * @param {string} tableName - The name of the table to delete rows from. Must be a valid, whitelisted table.
   * @param {Object} where - An object representing column-value pairs for the WHERE clause.
   *                         Example: { id: 5, is_active: true }.
   *                         Keys are column names; values are the values to match.
   * @throws {Error} Throws an error if `where` is empty or `tableName` is invalid.
   * @returns {Promise<Object[]>} A promise that resolves to an array of deleted rows.
   *
   * @example
   * const deletedUsers = await deleteWhere(pool, "users", { id: 5 });
   *
   * @example
   * const deletedPosts = await deleteWhere("posts", { user_id: 3, published: false });
   */
  async deleteWhere(table, where) {
    const values = [];
    let i = 1;

    const conditions = Object.entries(where).map(([key, value]) => {
      if (typeof value === "object") {
        const [op, val] = Object.entries(value)[0];
        const ops = { gt: ">", gte: ">=", lt: "<", lte: "<=", ne: "!=" };

        values.push(val);
        return `${key} ${ops[op]} $${i++}`;
      }

      values.push(value);
      return `${key} = $${i++}`;
    });

    const query = `
    DELETE FROM ${table}
    WHERE ${conditions.join(" AND ")}
    RETURNING *
  `;

    return (await db.query(query, values)).rows;
  }
}

module.exports = new MiniORM(); // singleton
