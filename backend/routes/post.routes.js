// File: routes/post.routes.js

import express from 'express';
import {
  addNewPost,
  getAllPost,
  getUserPosts,
  toggleLike,
  addComment,
  getComments,
  deletePost,
  toggleBookmark,
} from '../controllers/post.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

/**
 * @route   POST /api/v1/posts
 * @desc    Create a new post (image upload required)
 * @access  Private
 */
router.post(
  '/',
  isAuthenticated,
  upload.single('image'),
  addNewPost
);

/**
 * @route   GET /api/v1/posts
 * @desc    Get all posts (feed)
 * @access  Public
 */
router.get('/', getAllPost);

/**
 * @route   GET /api/v1/posts/user
 * @desc    Get posts for authenticated user
 * @access  Private
 */
router.get('/user', isAuthenticated, getUserPosts);

/**
 * @route   PATCH /api/v1/posts/:id/like
 * @desc    Like or unlike a post (toggle)
 * @access  Private
 */
router.patch('/:id/like', isAuthenticated, toggleLike);

/**
 * @route   POST /api/v1/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/:id/comments', isAuthenticated, addComment);

/**
 * @route   GET /api/v1/posts/:id/comments
 * @desc    Get comments for a specific post
 * @access  Public
 */
router.get('/:id/comments', getComments);

/**
 * @route   DELETE /api/v1/posts/:id
 * @desc    Delete a post and its comments
 * @access  Private
 */
router.delete('/:id', isAuthenticated, deletePost);

/**
 * @route   PATCH /api/v1/posts/:id/bookmark
 * @desc    Bookmark or remove bookmark for a post
 * @access  Private
 */
router.patch('/:id/bookmark', isAuthenticated, toggleBookmark);

export default router;
