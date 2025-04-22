import {logger} from '../middlewares/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    logger.error(`${req.method} ${req.url} - ${err.message}`);
    
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? null : err.stack,
    });
  };
  