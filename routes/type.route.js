const express = require("express");
const { Router } = express;
const typeRouter = Router();

const typeController = require("../controllers/type.controller");

// Getting a story by type
typeRouter.get("/:type", typeController.getAllStoriesWithType);
typeRouter.get("/:type/:id", typeController.getPostsForStoryWithType);

// Adding a post for a story with type
typeRouter.post("/:type/:id", typeController.createPostForStoryWithType);

// Adding a story with type
typeRouter.post("/:type", typeController.createStoryWithType)

// Update a story
typeRouter.put("/update/:type", typeController.updateStoryWithType);

module.exports = typeRouter;
