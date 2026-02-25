require("dotenv").config();

const ensureAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === "developemt") return next();
  const providedApiKey = req?.user?.user?.apiKey;
  const adminApiKey = process.env.API_KEY;

  if (providedApiKey && providedApiKey !== adminApiKey) {
    return res.status(401).json({ error: "NOT ADMIN" });
  }
  next();
};

module.exports = ensureAdmin;
