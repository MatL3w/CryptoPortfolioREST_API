//packages
import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

//project modules
import * as authRouter from './routes/auth.js';
import * as feedRouter from "./routes/feed.js";
import * as config from './config.js';


//core
const app = express();

app.use(bodyParser.json());

app.use(authRouter.router);
app.use(feedRouter.router);

app.use(function(error, req, res, next) {
  //console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message});
});

mongoose.set("strictQuery", true);
mongoose
  .connect(config.MONGODB_CONNECTION, {dbName:config.MONGODB_DATABASE_NAME})
  .then((result) => {
    //console.log("start");
    app.listen(config.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

