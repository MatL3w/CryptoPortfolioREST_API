import jwt from "jsonwebtoken";
import LogOutToken from "../models/logOutToken.js";
import * as util from "../util/util.js"
import * as config from "../config.js";


export const socketConnection = async  (wss) => {
    wss.on("connection", async (ws, req)=> {
        console.log('lol1');
        let index = req.rawHeaders.findIndex((ele) => ele === "Authorization");
        if (index === -1) {
            console.log("lol2");
          ws.terminate();
          return;
        }
        const token = req.rawHeaders[index + 1];
        console.log("lol3");
        if (!token) {
            console.log("lol4");
            ws.terminate();
            return;
        }
        try {
            console.log("lol5");
            const result = await LogOutToken.find({ token: token });
            if (result.length !== 0) {
                console.log("lol6");
            ws.terminate();
            return;
            }
        }
        catch (error) {
            console.log(error);
            console.log("lol7");
            ws.terminate();
            return;
        }
        let decodedToken;
        console.log("lol8");
        try {
            console.log("lol9");
            decodedToken = await jwt.verify(token, config.JWT_SECRET);
            const userId = decodedToken.userId;
            console.log("lol10");
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
