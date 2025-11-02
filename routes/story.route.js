const express = require("express");
const { Router } = express;
const storyRouter = Router();
const storyController = require("../controllers/story.controller");

// Get a post by its ID
storyRouter.get("/story/:storyId", storyController.getStoryById);

// Update a post by its ID
storyRouter.put("/update/story/:storyId", storyController.updateStoryByID);

// Delete a post by its ID
storyRouter.delete("/delete/story/:storyId", storyController.deleteStoryByID)

module.exports = storyRouter;
