require("dotenv").config();
// const { Pool } = require("pg");
const pg = require("pg");

pg.types.setTypeParser(1082, (val) => val);

const { Pool } = pg;

module.exports = new Pool({
  connectionString: process.env.DATABASE_URI_REPAIR_DEV,
  // connectionString: process.env.DATABASE_URI_REPAIR_PROD,
});
