const helloWorld= (req,res, next)=>{
    console.log("hello world");
    res.status(200).json({
        hello:'world'
    })
}

export default {helloWorld};