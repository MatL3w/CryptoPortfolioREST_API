import User from "../Models/user.js"
import * as util from '../util/util.js'

export const upsertAsset = async(req,res,next)=>{
    const userId = req.userId;
    const assetNameTag =req.body.assetNameTag;
    const assetQuantity = parseFloat(req.body.assetQuantity);
    try{
        if (!(userId && assetNameTag && assetQuantity)) {
            const error = new Error("wrong input data editasset");
            error.statusCode = 400;
            throw error;
        }
    }
    catch(err){
        next(err);
        return;
    }
    let user;
    let tokenInfo;
    try{
        user = await User.findOne({_id:userId});
        tokenInfo = await util.getTokenInfo(assetNameTag,assetQuantity);
        let assetExistIndex = user.assets.findIndex((ele) => ele.name === tokenInfo.name);
        if(assetExistIndex === -1){
            assetExistIndex = user.assets.findIndex((ele) => ele.symbol === tokenInfo.symbol);
        }
        if(assetExistIndex === -1){
            user.assets.push(tokenInfo);
            await user.save();
            res.status(201).json({ message: "Asset added", userId: user._id });
        }
        else{
            user.assets.splice(assetExistIndex, 1, tokenInfo);
            await user.save();
            res.status(201).json({ message: "Asset edited", userId: user._id });
        }
    }
    catch(err){
        err.statusCode = 400;
        next(err);
        return;
    }
}
export const deleteAsset = async(req,res,next)=>{
    const userId = req.userId;
    let assetNameTag = req.body.assetNameTag;
    try{
        if(!(userId && assetNameTag)){
            const error = new Error('wrong input data deleteasset');
            error.statusCode=422;
            throw error;
        }
    }
    catch(err){
        err.statusCode = 422;
        next(err);
        return;
    }
    assetNameTag = assetNameTag.toLowercase();
    let user;
    let assetExistIndex;
    try {
        user = await User.findOne({ _id:userId });
        if (!user) {
            return;
        }
        assetExistIndex = user.assets.findIndex((ele) => ele.nameTag === assetNameTag);
        if(assetExistIndex === -1){
            assetExistIndex = user.assets.findIndex((ele) => ele.name.toLocaleLowerCase() === assetNameTag);
        }
        if(assetExistIndex === -1){
            assetExistIndex = user.assets.findIndex((ele) => ele.symbol.toLocaleLowerCase() === assetNameTag);
        }
        if (assetExistIndex === -1) {
            res.status(422).json({ message: "There is no such asset!", userId: user._id });
        } 
        else {
            user.assets.pull(user.assets[assetExistIndex]._id)
            await user.save();
            res.status(201).json({ message: "Asset deleted", userId: user._id });
        }
    }
    catch (err) {
        err.statusCode = 422;
        next(err);
        return;
    }
}
export const getAssets = async(req,res,next)=>{
    const userId = req.userId;
    let user;
    try{
        user = await User.findOne({_id:userId});
        let tokenInfo;
        for(let i =0;i<user.assets.length;i++){
            tokenInfo = await util.getTokenInfo(user.assets[i].name, user.assets[i].quantity);
            user.assets.splice(i, 1, tokenInfo);
        }
        await user.save();
        res.status(201).json({ assets: user.assets, userId: user._id });
    }
    catch(err){
        err.statusCode = 422;
        next(err);
        return;
    }
}
export const getAsset = async(req,res,next)=>{
    const userId = req.userId;
    let assetNameTag = req.body.assetNameTag;
    try{
        if(!(userId && assetNameTag)){
            const error = new Error('wrong input get asset');
            error.statusCode=422;
            throw error;
        }
    }
    catch(err){
        err.statusCode = 422;
        console.log(err);
        next(err);
        return;
    }
    assetNameTag = assetNameTag.toLowerCase();
    let user;
    let tokenInfo;
    let asset;
    let assetIndex;
    try {
        user = await User.findOne({ _id: userId });
        assetIndex = user.assets.findIndex((ele) => ele.nameTag.toLowerCase() === assetNameTag);
        if(assetIndex === -1){
            assetIndex = user.assets.findIndex((ele) => ele.symbol.toLowerCase() === assetNameTag);
        }
        if (assetIndex === -1) {
          assetIndex = user.assets.findIndex((ele) => ele.name.toLowerCase() === assetNameTag);
        }
        if(assetIndex === -1){
            const error = new Error("Asset don't exist!");
            error.statusCode = 422;
            throw error;
        }
        else{
            tokenInfo = await util.getTokenInfo(user.assets[assetIndex].name,user.assets[assetIndex].quantity);
            user.assets.splice(assetIndex, 1, tokenInfo);
            await user.save();
            res.status(201).json({ asset: user.assets[assetIndex], userId: user._id });
        }
    }
    catch (err) {
        if(!err.statusCode)err.statusCode = 422;
        next(err);
        return;
    }
}