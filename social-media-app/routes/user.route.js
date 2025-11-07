const express = require("express");
const { Router } = express;
const userRouter = Router();

userRouter.get("/", (req, res) => res.send("All users"));

module.exports = userRouter
