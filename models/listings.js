const mongoose=require("mongoose");//requiring mongoose
const Schema=mongoose.Schema;//intitalized schema so it will be helpful as short form for writing more schemas
const Review=require("./review.js");//requiring review.js 

listingschema=new Schema({//new keyword is necessary as we are creating new schema so system must know that we are creting new schemas
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1751906599417-05d9577656a2?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",//Image is not filled or not found
        set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1751906599417-05d9577656a2?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v//Image is there but its null
    },
    price:{
        type:Number,
        required:true,
        min:1,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[//Added reviews for reviews scehema
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}})
    }}
);

const Listing=mongoose.model("Listing",listingschema);//requiring model

module.exports=Listing;
