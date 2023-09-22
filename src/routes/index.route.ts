import multer from "multer";
import express from "express";
 
import path from "path";
import {
  getAllSongs,
  getAllVideos,
  getLatestSongs,
  getRecentlyPlayedSongs,
  //getSimilarSongs,
  playSong,
  // searchSongs,
  //songByID,
  uploadSong,
  
} from "@/controllers/index.controller";
 

 
const router = express.Router();

const upload = multer({
  // storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
const songStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/storesongs/songs/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const suc = (req, res) => {
  try {
    console.log();
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    res.status(500).send("Error in File Uploading");
  }
};

// router.post("/uploadsongs",uploadSong)
router.get('/getsongs',getAllSongs)
router.post('/upload', upload.single("file"),suc);
router.get('/getlatest', getLatestSongs)

router.get("/playsong/:id", playSong);

router.get("/recentlyplayed", getRecentlyPlayedSongs);

 

// router.get("/search", searchSongs);
// router.get("/searchsimilarsongs", getSimilarSongs);
 
// router.get("/byid/:id",songByID)


 
import { uploadVideoToGridFS } from 'controllers/index.controller'; 
//import express from 'express';
// import multer from 'multer';

// const router = express.Router();
const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.post('/uploadvideo',upload.single('video'), uploadVideoToGridFS);

router.get('/getallvideos',getAllVideos)


export default router;

