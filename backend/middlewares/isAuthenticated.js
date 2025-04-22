// middlewares/isAuthenticated.js

import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT authentication from cookies
 * Adds user ID to req object if token is valid
 */
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuthenticated;
