const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
const {review}=require("../schema.js");//requiring Joi for server side validation (not mongoose validations)
const ExpressError=require("../utils/ExpressError.js");//requiring expresseroor to print expected error and message
const Listing = require("../models/listings.js");//requiring models and schema on which datas
const Review=require("../models/review.js");//requiring  models and schema for reviews 

//Middleware for Review Validation Schema
const validateReview=(req,res,next)=>{
    let {error}=review.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");//NEW
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

//REVIEWS ROUTE
router.post("/",
    validateReview,
    wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();//if ypu want to change any listing function in data
    res.redirect(`/listings/${req.params.id}`);
}))
//DELETE REVIEWS ROUTE
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

module.exports=router;