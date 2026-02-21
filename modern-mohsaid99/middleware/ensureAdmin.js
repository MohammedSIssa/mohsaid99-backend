require("dotenv").config();

const ensureAdmin = (req, res, next) => {
  const providedApiKey = req?.user?.user?.apiKey;
  const adminApiKey = process.env.API_KEY;

  if (providedApiKey && providedApiKey !== adminApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

module.exports = ensureAdmin;
