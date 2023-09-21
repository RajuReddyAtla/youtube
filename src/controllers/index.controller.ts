 

 import Song from "@/models/songs";

export const uploadSong = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No song file uploaded." });
    }

    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      filePath: req.file.path,
    });

    
    await newSong.save();
    console.log("Song uploaded successfully:", newSong);
    res.status(200).json({ message: "Song uploaded successfully" });
  } catch (error) {
    console.error("Error uploading song:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function use(arg0: (err: any, req: any, res: any, next: any) => void) {
  throw new Error("Function not implemented.");
}

export const upload = (req, res, next) => {
  res.status(200).json({ message: "File uploaded successfully." });
};


import { MongoClient } from "mongodb";
import mongoose from "mongoose";
const mongodb = require("mongodb");
 
const mongoURL = "mongodb://0.0.0:27017";  

const dbName = "you_app";
 
const client = new MongoClient(mongoURL);
const db = client.db(dbName);
const bucket = new mongodb.GridFSBucket(db, { bucketName: "appBucket" });

// code for get all songs

export const getAllSongs = async (req, res) => {
  try {
    const songs = await bucket.find({}).toArray();
    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};


 
import { GridFSBucket } from "mongodb";
//import { MongoClient } from "mongodb";  
import fs from "fs";
const fsp = fs.promises;

const connectionString = "mongodb://0.0.0:27017/you_app";

export const uploadVideoToGridFS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded." });
    }

    // console.log("SUCCESS");

    const name = req.file?.originalname;
    const buffer = req.file?.buffer;

    if (!name?.match(/\.(mp4|avi|mkv|mov)$/i)) {
      return res.status(400).json({ error: "Unsupported file format." });
    }

    const start = buffer.indexOf(Buffer.from("mvhd")) + 17;
    const timeScale = buffer.readUInt32BE(start, 4);
    const _d = buffer.readUInt32BE(start + 4, 4);
    const _a = Math.floor((_d / timeScale) * 1000) / 1000;
    const duration = Number(_a);

    if (duration > 15 && duration < 60) {
       
      const client = new MongoClient(connectionString, {
        // useNewUrlParser: true,  
        // useUnifiedTopology: true,  
      });

      await client.connect();
      const videoBucket = new GridFSBucket(client.db(), {
        bucketName: "videos",
      });

      const writeStream = await videoBucket.openUploadStream(name);

      writeStream.write(buffer);
      writeStream.end();

      writeStream.on("finish", async () => {
        const videoId = writeStream.id.toString();

        console.log(videoId);
        res.send({ ...req.body, ...req.file, buffer: undefined });
      });
    } else {
      // If duration exceeds the limit, don't store the video
      res.status(400).json({ error: "Video duration should be between 15 and 60 seconds." });
    }
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



 
export const getAllVideos=async (req, res) => {
  try {
    const client = new MongoClient(connectionString, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    await client.connect();
    const videoBucket = new GridFSBucket(client.db(), {
      bucketName: "videos",
    });
    const files = await videoBucket.find().toArray();

    const videoList = files.map((file) => ({
      id: file._id.toString(),
      filename: file.filename,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
    }));

    res.json(videoList);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

 //code for get song by id

export const songByID = async (req, res) => {
  try {
    const songId = req.params.id;
 
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: 'Invalid song ID format' });
    }
 
    const song = await bucket.find({ _id: new mongoose.Types.ObjectId(songId) }).toArray();

    if (song.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.status(200).json(song[0]);  
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: 'An error occurred while fetching the song.' });
  }
};

// code for get latest songs

export const getLatestSongs = async (req, res) => {
  try {
    const songs = await bucket
      .find({})
      .sort({ timestampField: -1, uploadDate: -1 })
      .limit(5)
      .toArray();

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching latest songs." });
  }
};

//code for play song



const recentsongs=[];

export const playSong = async (req, res) => {
    try {
        const songId = req.params.id;
     
        if (!mongoose.Types.ObjectId.isValid(songId)) {
          return res.status(400).json({ error: 'Invalid song ID format' });
        }
     
        const song = await bucket.find({ _id: new mongoose.Types.ObjectId(songId) }).toArray();
    
        if (song.length === 0) {
          return res.status(404).json({ error: 'Song not found' });
        }
    
        res.status(200).json("song played");  
        recentsongs.push(song)
      } catch (error) {
        console.error(error);  
        res.status(500).json({ error: 'An error occurred while fetching the song.' });
      }
  };

export const getRecentlyPlayedSongs = async (req, res) => {
  try {
    // Sort songs by the lastPlayed timestamp in descending order to get the recently played ones first
    const songs = await Song.find({}).sort({ lastPlayed: -1 }).limit(1).exec();

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching recently played songs.",
      });
  }
};

 


 