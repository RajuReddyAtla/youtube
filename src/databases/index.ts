 

import mongoose from 'mongoose';
import { MONGODB_URI } from '@config';
import { logger } from '@/utils/logger';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import path from 'path';
const bucketName = 'appBucket ';

export const songStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/storesongs/songs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName,
      };

      if (file.size > 20 * 1024 * 1024) {
        reject(new Error('File size should be less than 10MB.'));
      } else {
        resolve(fileInfo);
      }
    });
  },
});

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected To Database`);
  } catch (error) {
    logger.error(error);
  }
};

export default connectDatabase;
