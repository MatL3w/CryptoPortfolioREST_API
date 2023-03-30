import jwt from 'jsonwebtoken';

import LogOutToken from "../Models/logOutToken.js";
import * as config from "../config.js"

export const isAuth = async (req,res,next)=>{
    const authHeader = req.get('Authorization');
    try{
        if(!authHeader){
            const error = new Error("Unauthorized access!");
            error.statusCode = 401;
            throw error;
        }
    }
    catch(err){
        err.statusCode = 500;
        next(err);
        return;
    }
    try {
        const result  = await LogOutToken.find({token:authHeader});
        if(result.length !==0){
            console.log(result);
            const error = new Error("Token logged out!");
            error.statusCode = 401;
            throw error;
        }
    }
    catch (err) {
        err.statusCode = 500;
        next(err);
        return;
    }
    const token = authHeader;
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, config.JWT_SECRET);
    }
    catch(err){
        const error = new Error("Verification failed!");
        error.statusCode = 401;
        next(err);
        return;
    }
    req.userId = decodedToken.userId;
    next();
}