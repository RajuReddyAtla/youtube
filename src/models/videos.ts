// import mongoose from 'mongoose';

// const videoSchema = new mongoose.Schema({
//   title: String,
//   artist: String,
//   filePath: String,
//   lastPlayed: Date,
// });


// const Video=mongoose.model('Video', videoSchema);
// export default Video

// models/video.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface VideoDocument extends Document {
  title: string;
  url: string;
  mp3Path: string;
}

const VideoSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  mp3Path: { type: String, required: true },
});

export default mongoose.model<VideoDocument>('Video', VideoSchema);
