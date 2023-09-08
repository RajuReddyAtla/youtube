 

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
// MongoDB connection URL
const mongoURL = "mongodb://0.0.0.0:27017"; // Replace with your MongoDB server URL
// Database name
const dbName = "h_app";
// Create a MongoDB client
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
      .sort({ timestampField: -1 })
      .limit(3)
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

// code for searching songs

export const searchSongs = async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the request

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required." });
    }

    // Use MongoDB's text search to find songs that match the search query
    const songs = await Song.find({ $text: { $search: searchQuery } }).exec();

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for songs." });
  }
};

export const getSimilarSongs = async (req, res) => {
  try {
    const songId = req.params.id; // Assuming you have a route parameter for the song ID
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Use some logic to find similar songs based on shared characteristics like artist, genre, etc.
    // Here, we'll just find songs by the same artist as a simple example
    const similarSongs = await Song.find({ artist: song.artist })
      .limit(5)
      .exec();

    res.status(200).json(similarSongs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching similar songs." });
  }
};

 

