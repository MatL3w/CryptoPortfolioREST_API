import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';

import User from '../Models/user.js';
import * as config from '../config.js';

export const signup = async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try {
      if (!(email && name && password)) {
        const error = new Error("wrong input data for signup");
        error.statusCode = 400;
        throw error;
      }
    } catch (err) {
      next(err);
      return;
    }
    try{
        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({
            email:email,
            password:hashedPass,
            name:name
        })
        const result = await user.save();
        console.log(result);
        res.status(201).json({ message: "User created!", userId: result._id });
    }
    catch(err){
        next(err);
        return;
    }
}
export const signin = async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {
      if (!(email && password)) {
        const error = new Error("wrong input data for signin");
        error.statusCode = 400;
        throw error;
      }
    } catch (err) {
      next(err);
      return;
    }
    try{
        const user = await User.findOne({email:email});
        if(!user){
            return ;
        }
        const passwordCheck = await bcrypt.compare(password,user.password);
        if(!passwordCheck){
            return;
        }
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id,
            },
            config.JWT_SECRET,
            {
                expiresIn:config.JWT_EXPIRES_TIME
            }
        )
        res.status(200).json({ token: token, userId: user._id.toString() });
    }
    catch(err){
        next(err);
        return;
    }
    
}