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

const router = express.Router();

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

router.post("/:id/add-like", verifyToken, postIdValidator, createLike);
router.delete("/:id/delete-like", verifyToken, postIdValidator, deleteLike);
router.post("/:id/add-unlike", verifyToken, postIdValidator, createUnLike);
router.delete("/:id/delete-unlike", verifyToken, postIdValidator, deleteUnLike);

export default router;
