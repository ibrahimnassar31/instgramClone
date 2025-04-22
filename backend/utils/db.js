import mongoose from 'mongoose';
import {logger} from '../middlewares/logger.js';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,

    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error(`❌ DB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
