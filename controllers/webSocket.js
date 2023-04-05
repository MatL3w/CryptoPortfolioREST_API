import express from "express";
import expressWs from "express-ws";
import * as util from "../util/util.js"

expressWs(express());

export const socketConnection = (ws, req) => {
    console.log(ws.userId);
    ws.interval  = setInterval(async function () {
        const defilamaStatus = await util.defilamaIsOnline();
        const message = {
            online: defilamaStatus,
        };
        console.log(message);
        console.log(ws.userId);
        ws.send(JSON.stringify(message));
    }, 5000);
    ws.on("message", (msg) => {
        console.log(msg);
        ws.send(msg);
    });
    ws.on("close", function close() {
        clearInterval(ws.interval);
      console.log("disconnected");
    });

};
