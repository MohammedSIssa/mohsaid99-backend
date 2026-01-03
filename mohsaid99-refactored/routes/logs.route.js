const { Router } = require("express");
const logsRouter = Router();
const logsController = require("../controllers/logs.controller");

const { ensureAdmin } = require("./protected.route");

logsRouter
  .route("/")
  .get(ensureAdmin, logsController.getLogs)
  .post(logsController.addToLogs);

module.exports = logsRouter;
