const { Router } = require("express");
const postsRouter = Router();
const postsController = require("../controllers/post.controller");
const { ensureAdmin } = require("./protected.route");

postsRouter.post(
  "/:type/:storyid",
  ensureAdmin,
  postsController.addPostWithTypeAndID
);

postsRouter.get(
  "/:type/:storyid",
  postsController.getPostsForStoryWithTypeAndID
);

postsRouter.put(
  "/:type/:storyid/:postid",
  ensureAdmin,
  postsController.updatePostWithTypeAndID
);

postsRouter.delete(
  "/:type/:storyid/:postid",
  ensureAdmin,
  postsController.deletePostWithTypeAndID
);

module.exports = postsRouter;
