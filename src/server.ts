
import express from 'express';
import bodyParser from 'body-parser';
 
import songRoutes from './routes/index.route';
import connectDatabase from './databases';

const app = express();
app.use(bodyParser.json());


const port = process.env.PORT;
app.use('/',songRoutes);
// app.get('/', (req, res) => {
//   res.send('Upload file');
// });

 connectDatabase()
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
