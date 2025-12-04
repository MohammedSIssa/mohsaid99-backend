const express = require("express");
const { Router } = express;
const loginRouter = Router();
const loginController = require("../controllers/login.controller");

loginRouter.post("/", loginController.login);

module.exports = loginRouter