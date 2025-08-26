const Listing = require("../models/listings.js");//requiring models and schema on which datas
const Review=require("../models/review.js");//requiring  models and schema for reviews 

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    /* `newReview.author=req.user._id;` is assigning the author of the new review to the current user's
    ID. This line of code sets the author field of the new review object to the ID of the user who
    is currently logged in and creating the review. This helps in associating the review with the
    user who created it, allowing for better tracking and management of reviews within the system. */
    newReview.author=req.user._id;
    listing.reviews.push(newReview);//pushing newReview in reviews array

    await newReview.save();//saving new Review
    await listing.save();//if you want to save any listing function in data with review
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyRoute=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
};