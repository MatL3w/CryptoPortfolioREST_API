import jwt from 'jsonwebtoken';

import * as config from "../config.js"

export const isAuth= (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        res.status(500).json({message:"Unauthorized acces!"});
        return;
    }
    console.log(authHeader);
    const token = authHeader;
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, config.JWT_SECRET);
        console.log(decodedToken);
        
    }
    catch(err){
        return;
    }
    req.userId = decodedToken.userId;
    next();
}