const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
const {listing}=require("../schema.js");//requiring Joi for server side validation (not mongoose validations)
const ExpressError=require("../utils/ExpressError.js");//requiring expresseroor to print expected error and message
const Listing = require("../models/listings.js");//requiring model and schema on which datas 

//Middleware for Listings Validation Schema
const validatelisting=(req,res,next)=>{
    let {error}=listing.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");//NEW
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

//INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const data = await Listing.find();
    res.render("listings/index.ejs", { data });
}));

//NEW AND CREATE ROUTE
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});
router.post("/", validatelisting,wrapAsync(async (req, res,next) => {
    let list = req.body.listing;
    await Listing.insertOne(list);
    res.redirect("/listings");
}));

//SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params; //deconstructing of req.params
    const data1 = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { data1 });
}));

//EDIT AND UPDATE ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data2 = await Listing.findById(id);
    res.render("listings/edit.ejs", { data2 });
}));
router.put("/:id",validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = req.body.listing;
  //**********OR*********** */
//   await Listing.findByIdAndUpdate(id, {
//     title: listings.title,
//     description: listings.description,
//     image: listings.image,
//     price: listings.price,
//     country: listings.price,
//     country: listings.country,
//     location: listings.location,
//   });
    await Listing.findByIdAndUpdate(id,{...listings});//...listings
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    console.log(deletedata);
    res.redirect("/listings");
}));

module.exports=router;