import express from "express";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  increaseViews,
  createLike,
  deleteLike,
  createUnLike,
  deleteUnLike,
} from "../controllers/postCtrl.js";

import {
  createPostValidator,
  getPostValidator,
  updatePostValidator,
  deletePostValidator,
  postIdValidator,
} from "../utils/validators/postValidator.js";

import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import commentRouter from "./commentRoutes.js";

const router = express.Router();

router.use("/:postId/comments", commentRouter);

router
  .route("/")
  .get(getPosts)
  .post(verifyToken, authorizeRoles("author"), createPostValidator, createPost);

router
  .route("/:id")
  .get(getPostValidator, increaseViews, getPost)
  .put(
    verifyToken,
    authorizeRoles("admin", "author"),
    updatePostValidator,
    updatePost
  )
  .delete(
    verifyToken,
    authorizeRoles("admin", "author"),
    deletePostValidator,
    deletePost
  );

router.post("/:id/like", verifyToken, postIdValidator, createLike);
router.delete("/:id/like", verifyToken, postIdValidator, deleteLike);

router.post("/:id/unlike", verifyToken, postIdValidator, createUnLike);
router.delete("/:id/unlike", verifyToken, postIdValidator, deleteUnLike);

export default router;
