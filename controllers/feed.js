import User from "../Models/user.js"

export const editAsset = async(req,res,next)=>{
    const userId = req.userId;
    console.log(userId);
    const assetNameTag =req.body.assetNameTag;
    const assetQuantity =parseFloat(req.body.assetQuantity);
    let user;
    try{
        user = await User.findOne({_id:userId})
        if(!user){
            console.log('lol');
            return;
        }
        const assetExistIndex = user.asset.findIndex(ele=>ele.nameTag === assetNameTag);
        if(assetExistIndex === -1){
            user.asset.push({
              nameTag: assetNameTag,
              quantity: assetQuantity,
            });
            await user.save();
            res.status(201).json({ message: "Asset added", userId: user._id });
        }
        else{
            user.asset.splice(assetExistIndex, 1, {
              nameTag: assetNameTag,
              quantity: assetQuantity,
            });
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
    const assetNameTag = req.body.assetNameTag;
    let user;
    try {
        user = await User.findOne({ _id:userId });
        if (!user) {
            return;
        }
        const assetExistIndex = user.asset.findIndex((ele) => ele.nameTag === assetNameTag);
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