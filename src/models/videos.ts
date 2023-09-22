 
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
