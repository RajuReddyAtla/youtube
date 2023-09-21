 
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
        // Save video info to MongoDB
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
