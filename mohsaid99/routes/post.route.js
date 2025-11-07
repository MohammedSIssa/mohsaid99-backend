const express = require("express");
const { Router } = express;
const postRouter = Router();
const postController = require("../controllers/post.controller");

// Get a post by its ID
postRouter.get("/posts/:postId", postController.getPostById);

// Update a post by its ID
postRouter.put("/update/posts/:postId", postController.updatePostByID);

// Delete a post by its ID
postRouter.delete("/posts/delete/:postId", postController.deletePostByID)

module.exports = postRouter;
