// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/errorMidllerware.js';
import connectDB from './utils/db.js';
import {app,server} from './socket/socket.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoute from "./routes/message.routes.js";
import {logger} from './middlewares/logger.js';
// تحميل متغيرات البيئة
dotenv.config();

const morganStream = {
  write: (message) => logger.info(message.trim()),
};

app.use(morgan('combined', { stream: morganStream }));



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// ميدل وير
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

app.use(errorMiddleware);

// مسارات API
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use("/api/v1/message", messageRoute);

app.use(limiter);

// الاتصال بقاعدة البيانات
connectDB();

// تشغيل السيرفر
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
