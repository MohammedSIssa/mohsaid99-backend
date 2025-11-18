require("dotenv").config();

const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: process.env.DATABASE_URI_SOCIAL_DEV,
});
