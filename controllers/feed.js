import User from "../Models/user.js"

export const editAsset = async(req,res,next)=>{
    const email = req.body.email;
    const assetNameTag =req.body.assetNameTag;
    const assetQuantity =parseFloat(req.body.assetQuantity);
    let user;
    try{
        user = await User.findOne({email:email})
        if(!user){
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

    }
}