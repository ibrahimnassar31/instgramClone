
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/**
 * @route   POST /api/v1/users/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/v1/users/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/v1/users/logout
 * @desc    Logout user (clear cookie)
 * @access  Public
 */
router.post("/logout", logout);


/**
 * @route   GET /api/v1/users/suggestions
 * @desc    Get suggested users to follow
 * @access  Private
 */
router.get("/suggestions", isAuthenticated, getSuggestedUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get("/profile/:id", isAuthenticated, getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);


/**
 * @route   PATCH /api/v1/users/:id/follow
 * @desc    Follow or unfollow user
 * @access  Private
 */
router.patch("/:id/follow", isAuthenticated, followOrUnfollow);

export default router;
