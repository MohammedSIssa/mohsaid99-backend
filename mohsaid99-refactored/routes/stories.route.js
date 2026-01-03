const { Router } = require("express");
const storiesRouter = Router();
const storiesController = require("../controllers/stories.controller");
const { ensureAdmin } = require("./protected.route");

storiesRouter
  .route("/")
  .get(storiesController.getStories)
  .post(ensureAdmin, storiesController.createStory)
  .put(ensureAdmin, storiesController.updateStoryWithType)
  .delete(ensureAdmin, storiesController.deleteStoryByID);

module.exports = storiesRouter;
