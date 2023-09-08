import multer from "multer";
import express from "express";
import { storage } from "@/databases";
import path from "path";
import {
  getAllSongs,
  getLatestSongs,
  getRecentlyPlayedSongs,
  getSimilarSongs,
  playSong,
  searchSongs,
  songByID,
} from "@/controllers/index.controller";
const router = express.Router();

const upload = multer({
  storage,
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

router.get('/getsongs',getAllSongs)
router.post('/upload', upload.single("file"),suc);
router.get('/getlatest', getLatestSongs)

router.get("/playsong/:id", playSong);


router.get("/recentlyplayed", getRecentlyPlayedSongs);
 

//code for searching songs

router.get("/search", searchSongs);
router.get("/searchsimilarsongs", getSimilarSongs);
 
router.get("/byid/:id",songByID)

export default router;
