//packages
import express from "express";
import bodyParser from 'body-parser';

//project modules
import feedRouter from './routes/feed.js';


//core
const app = express();

app.use(bodyParser.json());
app.use(feedRouter.router);

app.listen(3000);