const express = require("express");
const { Router } = express;
const userRouter = Router();
const userController = require("../controllers/user.controller");

userRouter.get("/", userController.getAllUsers);

userRouter.get("/:id", userController.getUserById);
userRouter.get("/:id/followers", userController.getFollowers);
userRouter.get("/:id/following", userController.getFollowing);

userRouter.post("/:id/follow/:target", userController.followAccount);
userRouter.post("/:id/unfollow/:target", userController.unfollowAccount);

module.exports = userRouter;
