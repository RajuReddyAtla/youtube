import express from "express";
import bodyParser from "body-parser";

import songRoutes from "./routes/index.route";
import vidoeRoutes from "./routes/video.route";
import connectDatabase from "./databases";
import app from "./app";
//import { convertVideoToMP3 } from "./controllers/video.controller";

app.use(bodyParser.json());

const port = process.env.PORT;
app.use("/", songRoutes);
app.use("/", vidoeRoutes);
// app.get('/', (req, res) => {
//   res.send('Upload file');
// });
//app.use('/youtube',convertVideoToMP3)

connectDatabase();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
