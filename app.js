//packages
import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cluster from "cluster";
import os from "os";
import helmet from "helmet";
import morgan from "morgan"
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";


//project modules
import * as authRouter from './routes/auth.js';
import * as feedRouter from "./routes/feed.js";
import * as webSocketController from "./controllers/webSocket.js";
import * as config from './config.js';


const numCPUs = os.cpus().length;
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
    const app = express();
    const options = {
      key: fs.readFileSync("privatekey.pem"),
      cert: fs.readFileSync("certificate.pem"),
    };
    const server = http.createServer(app);
    const wss = new WebSocketServer({ path: "/socket", server });
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags: "a",});

    app.use(morgan("combined", { stream: accessLogStream }));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
        res.setHeader("Access-Control-Allow-Headers","*");
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    });
    app.use(authRouter.router);
    app.use(feedRouter.router);
    app.use(function(error, req, res, next) {
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message});
    });
    webSocketController.socketConnection(wss);

    mongoose.set("strictQuery", true);
    mongoose
      .connect(config.MONGODB_CONNECTION, {dbName:config.MONGODB_DATABASE_NAME})
      .then((result) => {
        server.listen(config.PORT || 3000);
      })
      .catch((err) => {
        console.log(err);
      });
    }