import User from "../Models/user.js"
import * as util from '../util/util.js'

export const editAsset = async(req,res,next)=>{
    const userId = req.userId;
    const assetNameTag =req.body.assetNameTag;
    const assetQuantity =parseFloat(req.body.assetQuantity);
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
        if(!user){
            console.log('lol');
            return;
        }
        const assetExistIndex = user.asset.findIndex(ele=>ele.nameTag === assetNameTag);
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
        next(err);
    }
}
export const deleteAsset = async(req,res,next)=>{
    const userId = req.userId;
    const assetNameTag = req.body.assetNameTag.toLowerCase();
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
        next(err);
    }
}