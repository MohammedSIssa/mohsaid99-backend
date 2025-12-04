const express = require("express");
const { Router } = express;
const hcfsRouter = Router();

const hcfsController = require("../controllers/hcfs.controller");

hcfsRouter.get("/partner-types", hcfsController.getAllPartnerTypes);
hcfsRouter.get("/partner-names", hcfsController.getAllPartnerNames);

module.exports = hcfsRouter;
