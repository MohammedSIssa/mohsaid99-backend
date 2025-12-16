const { Router } = require("express");
const logsRouter = Router();
const logsController = require("../controllers/logs.controller");

const { ensureAdmin } = require("./protected.route");

logsRouter.post("/", logsController.addToLogs);
logsRouter.get("/", ensureAdmin, logsController.getLogs);

module.exports = logsRouter;
