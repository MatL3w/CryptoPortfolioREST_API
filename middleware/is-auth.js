import jwt from 'jsonwebtoken';

import * as config from "../config.js"

export const isAuth= (req,res,next)=>{
    const authHeader = req.get('Authorization');
    try{
        if(!authHeader){
            const error = new Error("Unauthorized access!");
            error.statusCode = 401;
            throw error;
        }
    }
    catch(err){
        next(err);
        return;
    }
    const token = authHeader;
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, config.JWT_SECRET);
    }
    catch(err){
        const error = new Error("Unauthorized access!");
        error.statusCode = 401;
        next(err);
        return;
    }
    req.userId = decodedToken.userId;
    next();
}