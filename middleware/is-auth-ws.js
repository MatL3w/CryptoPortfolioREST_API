import jwt from "jsonwebtoken";
import LogOutToken from "../models/logOutToken.js";
import express from "express";
import expressWs from "express-ws";
import * as config from "../config.js";
import * as app from "../app.js";

export const isAuth = async (ws, req, next) => {
    const token = req.get("Authorization");
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
        ws.terminate();
        return;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, config.JWT_SECRET);
        const userId = decodedToken.userId;
        app.getWss().clients.forEach((ele) => {
            if(ele.userId === userId){
                ele.terminate();
            }
        });
        const milisecondsToExpire = decodedToken.exp * 1000 - new Date().getTime();
        setTimeout(()=>{ws.terminate()},milisecondsToExpire);
    } catch (err) {
        ws.terminate();
        return;
    }
    ws.userId = decodedToken.userId;
    next();
};
