const { Router } = require("express");
const storiesRouter = Router();
const storiesController = require("../controllers/stories.controller");
const { ensureAdmin } = require("./protected.route");

storiesRouter.post("/:type", ensureAdmin, storiesController.createStory);

storiesRouter.get("/:type", storiesController.getStoriesForType);

storiesRouter.put(
  "/:type/:storyid",
  ensureAdmin,
  storiesController.updateStoryWithType
);

storiesRouter.delete(
  "/:type/:storyid",
  ensureAdmin,
  storiesController.deleteStoryByID
);

module.exports = storiesRouter;
