import mongoose from 'mongoose';
import { MONGODB_URI } from '@config';
import { logger } from '@/utils/logger';

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected To Database`);
  } catch (error) {
    logger.error(error);
  }
};

export default connectDatabase;
