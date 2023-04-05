//packages
import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressWs from "express-ws";

//project modules
import * as authRouter from './routes/auth.js';
import * as feedRouter from "./routes/feed.js";
import * as webSocketRouter from "./routes/webSocket.js";
import * as config from './config.js';

import cluster from "cluster";
import http from "http";
import os from "os";
const numCPUs = os.cpus().length;
export const { app, getWss, applyTo } = expressWs(express());

//core
console.log(numCPUs);
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  
  console.log(`Worker ${process.pid} started`);



app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers","X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// setInterval(()=>{
//     console.log(getWss().clients.size);
//     getWss().clients.forEach(ele=>{
//         ele.send("elooo");
//         console.log(ele.userId);
//         // if(ele.userId){
//         //   ele.terminate();
//         // }
//     });
// },3000);
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