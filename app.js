//packages
import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressWs from "express-ws";
import cluster from "cluster";
import os from "os";
import helmet from "helmet";

//project modules
import * as authRouter from './routes/auth.js';
import * as feedRouter from "./routes/feed.js";
import * as webSocketRouter from "./routes/webSocket.js";
import * as config from './config.js';


const numCPUs = os.cpus().length;
export const { app, getWss, applyTo } = expressWs(express());
export let defilamaStatus = false;

//core
if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        cluster.fork();
    });
} 
else {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
        res.setHeader("Access-Control-Allow-Headers","X-Requested-With,content-type");
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    });

    app.use((req,res,next)=>{
      console.log(`Worker ${process.pid}  handled`);
      next();
    });
    app.use(webSocketRouter.router);
    app.use(authRouter.router);
    app.use(feedRouter.router);

    app.use(function(error, req, res, next) {
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message});
    });

    mongoose.set("strictQuery", true);
    mongoose
      .connect(config.MONGODB_CONNECTION, {dbName:config.MONGODB_DATABASE_NAME})
      .then((result) => {
        app.listen(config.PORT || 3000);
      })
      .catch((err) => {
        console.log(err);
      });
    }