import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  filePath: String,
  lastPlayed: Date,
});

songSchema.index({ title: 'text', artist: 'text' }); //poojitha code

const Song=mongoose.model('Song', songSchema);
export default Song