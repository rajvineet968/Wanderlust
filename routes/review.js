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

    listing.reviews.push(newReview);//pushing newReview in reviews array

    await newReview.save();//saving new Review
    await listing.save();//if you want to save any listing function in data with review
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${req.params.id}`);
}))
//DELETE REVIEWS ROUTE
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;