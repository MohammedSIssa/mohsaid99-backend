const { Router } = require("express");
const searchRouter = Router();
const searchController = require("../controllers/search.controller");

searchRouter.get("/", searchController.searchProduct);

module.exports = searchRouter;
