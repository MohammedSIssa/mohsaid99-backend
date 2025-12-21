const { Router } = require("express");
const vehiclesController = require("../controllers/v.data.controller");

const vehiclesDataRouter = Router();

vehiclesDataRouter.get("/", vehiclesController.getAllVehicleData);

vehiclesDataRouter.post("/", vehiclesController.createVehicle);

vehiclesDataRouter.delete("/:id", vehiclesController.deleteVehicleById);

vehiclesDataRouter.get("/vcode/all", vehiclesController.getAllVehicleCode);

vehiclesDataRouter.get(
  "/vcode/:vcode",
  vehiclesController.getDataByVehicleCode
);

vehiclesDataRouter.get(
  "/licence/:licence",
  vehiclesController.getVehicleByLicenceNumber
);

vehiclesDataRouter.get("/state/:state", vehiclesController.getVehiclesByState);

module.exports = vehiclesDataRouter;
