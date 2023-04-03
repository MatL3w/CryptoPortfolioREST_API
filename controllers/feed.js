import User from "../Models/user.js"
import Asset from "../Models/asset.js";
import * as util from '../util/util.js'
import mongoose from "mongoose";

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
    let assetExistIndex;
    try{
        user = await User.findOne({ _id: userId }).populate("assets");
        tokenInfo = await util.getTokenInfo(assetNameTag, assetQuantity);
        assetExistIndex = user.assets.findIndex((ele) => { ele.name === tokenInfo.name;});
         if(assetExistIndex === -1){
          assetExistIndex = user.assets.findIndex((ele) => ele.symbol === tokenInfo.symbol);
        }
        if(assetExistIndex === -1){
            const asset = new Asset({
                quantity: assetQuantity,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
            });
            await asset.save();
            user.assets.push(asset._id);
            await user.save();
            res.status(201).json({ message: "Asset added", userId: user._id });
        }
        else{
            const asset = await Asset.findById(user.assets[assetExistIndex]._id);
            asset.quantity=assetQuantity;
            console.log(asset);
            await asset.save();
            res.status(201).json({ message: "Asset updated", userId: user._id });
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
            error.statusCode=400;
            throw error;
        }
    }
    catch(err){
        next(err);
        return;
    }
    assetNameTag = assetNameTag.toLowerCase();
    let user;
    let assetExistIndex;
    try {
        user = await User.findOne({ _id:userId }).populate('assets');
        if (!user) {
            const error = new Error("User don't exist");
            error.statusCode = 422;
            throw error;
        }
        assetExistIndex = user.assets.findIndex((ele) => ele.symbol.toLowerCase() === assetNameTag);
        if(assetExistIndex === -1){
            assetExistIndex = user.assets.findIndex((ele) => ele.name.toLowerCase() === assetNameTag);
        }
        if (assetExistIndex === -1) {
            res.status(422).json({ message: "There is no such asset!", userId: user._id });
        } 
        else {
            const id = user.assets[assetExistIndex]._id;
            await user.assets.pull(id);
            await Asset.findByIdAndDelete(id);
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
    let tokenInfoArray = [];
    try{
        user = await User.findOne({_id:userId}).populate('assets');
        for(let i =0;i<user.assets.length;i++){
           let tokenInfo = await util.getTokenInfo(user.assets[i].name,user.assets[i].quantity);
           tokenInfoArray.push(tokenInfo);
        }
        await user.save();
        res.status(201).json({ assets: tokenInfoArray, userId: user._id });
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
    let assetIndex;
    try {
        user = await User.findOne({ _id: userId }).populate('assets');
        assetIndex = user.assets.findIndex((ele) => ele.name.toLowerCase() === assetNameTag);
        if(assetIndex === -1){
            assetIndex = user.assets.findIndex((ele) => ele.symbol.toLowerCase() === assetNameTag);
        }
        if(assetIndex === -1){
            const error = new Error("Asset don't exist!");
            error.statusCode = 422;
            throw error;
        }
        else{
            tokenInfo = await util.getTokenInfo(user.assets[assetIndex].name,user.assets[assetIndex].quantity);
            res.status(201).json({ asset: tokenInfo, userId: user._id });
        }
    }
    catch (err) {
        if(!err.statusCode)err.statusCode = 422;
        next(err);
        return;
    }
}
