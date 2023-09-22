 
import { convertVideoToMP3, getAllConvertedSongs } from '@/controllers/video.controller';
import { uploadVideoToGridFS } from 'controllers/index.controller'; 
import express from 'express';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadvideo',upload.single('video'), uploadVideoToGridFS);

router.post('/youtube-to-audio',convertVideoToMP3)

router.get('/getallaudio',getAllConvertedSongs)

export default router;