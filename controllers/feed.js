import User from "../Models/user.js"
import * as util from '../util/util.js'

export const editAsset = async(req,res,next)=>{
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
    let completeTokenInfo;
    try{
        user = await User.findOne({_id:userId})
        tokenInfo = await util.getTokenInfo(assetNameTag);
        console.log(tokenInfo);
        completeTokenInfo = Object.assign(
            {
                nameTag: assetNameTag,
                quantity: assetQuantity,
            },
            tokenInfo,
            {
                totalValue: assetQuantity * parseFloat(tokenInfo.price),
            }
        );
        let assetExistIndex = user.asset.findIndex(ele=>ele.nameTag === assetNameTag);
        if(assetExistIndex === -1){
            assetExistIndex = user.asset.findIndex((ele) => ele.name.toLocaleLowerCase() === assetNameTag);
        }
        if(assetExistIndex === -1){
            assetExistIndex = user.asset.findIndex((ele) => ele.symbol.toLocaleLowerCase() === assetNameTag);
        }
        if(assetExistIndex === -1){
            user.asset.push(completeTokenInfo);
            await user.save();
            res.status(201).json({ message: "Asset added", userId: user._id });
        }
        else{
            user.asset.splice(assetExistIndex,1,completeTokenInfo);
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
        assetExistIndex = user.asset.findIndex((ele) => ele.nameTag === assetNameTag);
        if(assetExistIndex === -1){
            assetExistIndex = user.asset.findIndex((ele) => ele.name.toLocaleLowerCase() === assetNameTag);
        }
        if(assetExistIndex === -1){
            assetExistIndex = user.asset.findIndex((ele) => ele.symbol.toLocaleLowerCase() === assetNameTag);
        }
        if (assetExistIndex === -1) {
            res.status(422).json({ message: "There is no such asset!", userId: user._id });
        } 
        else {
            user.asset.pull(user.asset[assetExistIndex]._id)
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
export const getAsset = async(req,res,next)=>{
    const userId = req.userId;
}