import express from "express";

import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  setPostIdToBody,
} from "../controllers/commentCtrl.js";

import {
  createCommentValidator,
  getCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
} from "../utils/validators/commentValidator.js";

import verifyToken from "../middlewares/authMiddleware.js";
import createFilterObj from "../middlewares/filterMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj({postParam: true}), getComments)
  .post(
    verifyToken,
    setPostIdToBody,
    createCommentValidator,
    createComment
  );

router
  .route("/:id")
  .get(getCommentValidator, getComment)
  .put(
    verifyToken,
    updateCommentValidator,
    updateComment
  )
  .delete(
    verifyToken,
    deleteCommentValidator,
    deleteComment
  );

export default router;
