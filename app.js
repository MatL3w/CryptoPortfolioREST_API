//packages
import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

//project modules
import * as feedRouter from './routes/feed.js';
import * as config from './config.js';


//core
const app = express();

app.use(bodyParser.json());
app.use(feedRouter.router);

mongoose.set("strictQuery", true);
mongoose
  .connect(config.MONGODB_CONNECTION, {dbName:config.MONGODB_DATABASE_NAME})
  .then((result) => {
    app.listen(config.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

