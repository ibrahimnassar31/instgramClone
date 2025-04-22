import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { sendMessage, getMessage } from "../controllers/messege.controller.js";
const router = express.Router();

/**
 * @route   POST /api/v1/messages/send/:receiverId
 * @desc    Send a new message to a user
 * @access  Private
 */
router.post('/send/:receiverId', isAuthenticated, sendMessage);

/**
 * @route   GET /api/v1/messages/all/:userId
 * @desc    Get all messages between the logged-in user and another user
 * @access  Private
 */
router.get('/all/:userId', isAuthenticated, getMessage);

export default router;
