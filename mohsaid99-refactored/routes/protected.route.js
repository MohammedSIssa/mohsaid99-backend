require("dotenv").config();
const API_KEY = process.env.API_KEY;

function ensureAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const api_key = authHeader && authHeader.split(" ")[1];
  if (!api_key || api_key !== API_KEY)
    return res.status(403).json({ error: "Missing or Invalid API Key" });

  // console.log("Authenticated!");
  next();
}

module.exports = { ensureAdmin };
