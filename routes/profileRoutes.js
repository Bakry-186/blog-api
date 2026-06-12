import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyProfile,
} from "../controllers/profileCtrl.js";

import { getComments } from "../controllers/commentCtrl.js";
import { getPosts } from "../controllers/postCtrl.js";

import {
  updateProfileValidator,
  changePasswordValidator,
} from "../utils/validators/profileValidator.js";

import { getUser } from "../controllers/adminCtrl.js";

import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import createFilterObj from "../middlewares/filterMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Current user profile management
 */

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update current user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete current user's profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Profile deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route("/me")
  .get(verifyToken, getMyProfile, getUser)
  .put(verifyToken, updateProfileValidator, updateMyProfile)
  .delete(verifyToken, deleteMyProfile);

/**
 * @swagger
 * /profiles/change-password:
 *   put:
 *     summary: Change current user's password
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, password, passwordConfirm]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/change-password",
  verifyToken,
  changePasswordValidator,
  changeMyPassword
);

/**
 * @swagger
 * /profiles/me/posts:
 *   get:
 *     summary: Get posts created by the current user (Author only)
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Author role required
 */
router.get(
  "/me/posts",
  verifyToken,
  authorizeRoles("author"),
  createFilterObj({ authorField: true }),
  getPosts
);

/**
 * @swagger
 * /profiles/me/comments:
 *   get:
 *     summary: Get comments made by the current user
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of user's comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me/comments",
  verifyToken,
  createFilterObj({ userField: true }),
  getComments
);

export default router;
