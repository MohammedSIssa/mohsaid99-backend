const { Router } = require("express");
const localMarketRouter = Router();

const loginRouter = require("./routes/login.route");
const registerRouter = require("./routes/register.route");
const searchRouter = require("./routes/search.route");

localMarketRouter.use("/login", loginRouter);
localMarketRouter.use("/register", registerRouter);
localMarketRouter.use("/search", searchRouter);

module.exports = localMarketRouter;
