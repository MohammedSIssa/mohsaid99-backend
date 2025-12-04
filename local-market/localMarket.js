const { Router } = require("express");
const localMarketRouter = Router();

const loginRouter = require("./routes/login.route");
const registerRouter = require("./routes/register.route");
 
localMarketRouter.use("/login", loginRouter)
localMarketRouter.use("/register", registerRouter);

module.exports = localMarketRouter