 
import { Request, Response } from 'express';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import Video from '@/models/videos';

export const convertVideoToMP3 = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const videoInfo = await ytdl.getInfo(url);
    const audioStream = ytdl(url, { quality: 'highestaudio' });

    const outputPath = `output.mp3`;

    ffmpeg()
      .input(audioStream)
      .toFormat('mp3')
      .save(outputPath)
      .on('end', async () => {
         
        const video = new Video({
          title: videoInfo.videoDetails.title,
          url: url,
          mp3Path: outputPath,
        });

        await video.save();

        res.download(outputPath, (err) => {
          if (err) {
            console.error('Error sending the file:', err);
          } else {
            console.log('File sent successfully');
          }
        });
      });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
};

export const getAllConvertedSongs = async (req: Request, res: Response) => {
  try {
    // Use Mongoose to find all videos with MP3 files
    const convertedSongs = await Video.find({ mp3Path: { $exists: true } });

    // Send the list of converted songs as a JSON response
    res.status(200).json(convertedSongs);
  } catch (error) {
    console.error('Error retrieving converted songs:', error);
    res.status(500).json({ error: 'Error retrieving converted songs' });
  }
};