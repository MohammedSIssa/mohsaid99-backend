const { Router } = require("express");
const postsRouter = Router();
const postsController = require("../controllers/post.controller");
const { ensureAdmin } = require("./protected.route");

postsRouter
  .route("/")
  .get(postsController.getPosts)
  .post(ensureAdmin, postsController.createPost)
  .put(ensureAdmin, postsController.updatePostWithTypeAndID)
  .delete(ensureAdmin, postsController.deletePostWithTypeAndID);

module.exports = postsRouter;
