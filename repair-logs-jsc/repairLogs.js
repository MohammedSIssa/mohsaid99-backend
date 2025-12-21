const { Router } = require("express");
const repairsRouter = Router();

const vehiclesDataRouter = require("./routes/v.data.route");
const repairTermsRouter = require("./routes/repair.terms.route");
const logsRouter = require("./routes/logs.route");

repairsRouter.use("/vehicles", vehiclesDataRouter);
repairsRouter.use("/terms", repairTermsRouter);
repairsRouter.use("/logs", logsRouter);

module.exports = repairsRouter;
