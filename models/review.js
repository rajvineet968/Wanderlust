const mongoose=require("mongoose");//requiring mongoose
const Schema=mongoose.Schema;//intitalized schema so it will be helpful as short form for writing more schemas

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
})

module.exports=mongoose.model("Review",reviewSchema);