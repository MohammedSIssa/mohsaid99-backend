const { Router } = require("express");
const logsRouter = Router();

const logsController = require("../controllers/logs.controller");

logsRouter.get("/", logsController.getLogs);
logsRouter.post("/", logsController.createLog);
logsRouter.get("/:id", logsController.getLogById);
logsRouter.delete("/:id", logsController.deleteLogById);
logsRouter.put("/:id", logsController.updateLogById);

module.exports = logsRouter;
