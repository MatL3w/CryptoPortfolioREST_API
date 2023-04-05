import jwt from "jsonwebtoken";
import LogOutToken from "../models/logOutToken.js";
import * as util from "../util/util.js"
import * as config from "../config.js";


export const socketConnection = async  (wss) => {
    wss.on("connection", async (ws, req)=> {
        let index = req.rawHeaders.findIndex((ele) => ele === "Authorization");
        if (index === -1) {
          ws.terminate();
          return;
        }
        const token = req.rawHeaders[index + 1];
        if (!token) {
            ws.terminate();
            return;
        }
        try {
            const result = await LogOutToken.find({ token: token });
            if (result.length !== 0) {
            ws.terminate();
            return;
            }
        }
        catch (error) {
            console.log(error);
            ws.terminate();
            return;
        }
        let decodedToken;
        try {
            decodedToken = await jwt.verify(token, config.JWT_SECRET);
            const userId = decodedToken.userId;
            wss.clients.forEach((ele) => {
                if(ele.userId === userId){
                    ele.terminate();
                }
            });
            const milisecondsToExpire = decodedToken.exp * 1000 - new Date().getTime();
            setTimeout(()=>{ws.terminate()},milisecondsToExpire);
        }
        catch (err) {
            ws.terminate();
            return;
        }
        ws.userId = decodedToken.userId;
        ws.interval = setInterval(async function () {
            const defilamaStatus = await util.defilamaIsOnline();
            const message = {
                online: defilamaStatus,
            };
            ws.send(JSON.stringify(message));
        }, 5000);
        ws.on("message", (msg) => {
            ws.send(msg);
        });
        ws.on("close", function close() {
            clearInterval(ws.interval);
        });
    });
};
