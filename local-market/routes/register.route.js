const { Router } = require("express");
const registerRouter = Router();
const registerController = require("../controllers/register.controller");

registerRouter.post("/", registerController.register);

module.exports = registerRouter;
