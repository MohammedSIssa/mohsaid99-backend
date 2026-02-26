require("dotenv").config();

const ensureAdmin = (req, res, next) => {
  // if (process.env.NODE_ENV === "development") return next();
  const adminApiKey = process.env.API_KEY;

  const user = req.user.user;
  const providedApiKey = user.apikey;

  if (!providedApiKey) return res.status(401).json({ error: "NOT ADMIN" });
  if (providedApiKey && providedApiKey !== adminApiKey) {
    return res.status(401).json({ error: "NOT ADMIN" });
  }
  next();
};

module.exports = ensureAdmin;
