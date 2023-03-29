import express from "express";
import feedRouter from './routes/feed.js';

const app = express();

app.use(feedRouter.router);

app.listen(3000);