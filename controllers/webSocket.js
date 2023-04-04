import express from "express";
import expressWs from "express-ws";
expressWs(express());

export const socketConnection = (ws, req) => {
    console.log(ws.userId);
    ws.on("message", (msg) => {
        console.log(msg);
        ws.send(msg);
    });
};
