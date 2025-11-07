const express = require("express");
const { Router } = express;
const logsRouter = Router();
const logsController = require("../controllers/logs.controller");

logsRouter.get("/logs", logsController.getLogs)
logsRouter.post("/log", logsController.addLog);

module.exports = logsRouter;
