const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
// const {review}=require("../schema.js");//requiring Joi for server side validation (not mongoose validations)
// const ExpressError=require("../utils/ExpressError.js");//requiring expresseroor to print expected error and message
const Listing = require("../models/listings.js");//requiring models and schema on which datas
const Review=require("../models/review.js");//requiring  models and schema for reviews 
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");//MVC framework : Controllers

//REVIEWS ROUTE
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


//DELETE REVIEWS ROUTE
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyRoute)
);

module.exports=router;