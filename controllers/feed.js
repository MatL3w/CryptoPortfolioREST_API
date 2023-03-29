import bcrypt from 'bcrypt';

import User from '../Models/user.js';

export const helloWorld= (req,res, next)=>{
    console.log("hello world");
    res.status(200).json({
        hello:'world'
    })
}
export const addUser = async (req,res,next)=>{
    if(!req.body){
        return ;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try{
        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({
            email:email,
            password:password,
            name:name
        })
        const result = await user.save();
        console.log(result);
        res.status(201).json({ message: "User created!", userId: result._id });
    }
    catch(err){
        next(err);
    }
}
