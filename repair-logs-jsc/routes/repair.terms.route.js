const { Router } = require("express");
const repairTermsRouter = Router();

const repairTermsController = require("../controllers/repair.terms.controller");

repairTermsRouter.get("/", repairTermsController.getAllRepairTermsData);

repairTermsRouter.post("/", repairTermsController.createTerm);

repairTermsRouter.delete("/:id", repairTermsController.deleteTermById);

repairTermsRouter.get("/type/all", repairTermsController.getAllRepairTypes);

repairTermsRouter.get(
  "/type/:type",
  repairTermsController.getTermsByRepairType
);

repairTermsRouter.get("/name/all", repairTermsController.getAllTermNames);
repairTermsRouter.get("/name/:name", repairTermsController.getDataByTermName);

repairTermsRouter.get("/term/all", repairTermsController.getAllTermsNums);

repairTermsRouter.get("/term/:term", repairTermsController.getDataByTermNumber);

module.exports = repairTermsRouter;
