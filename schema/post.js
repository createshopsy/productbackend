const mongoose=require("mongoose")

const Postfeed=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"instauser"
    },
    caption:{
        type:String,
    },
    hashtag:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        type:Array,
    },
    video:{
        type:Array,
    }
    
},
{ timestamps: true },
)

const postfeature=mongoose.model("postfeed",Postfeed)

module.exports={postfeature}