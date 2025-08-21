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
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
}));

//SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params; //deconstructing of req.params
    const data1 = await Listing.findById(id).populate("reviews");
    if(!data1){
        req.flash("error","Your listing is not present");//any error is there it will show warning like the url you want to check is not present
        return res.redirect("/listings");//return is must because it After res.redirect("/listings"), the code will still try to run res.render (which causes "Cannot set headers after they are sent" error sometimes).👉 Fix: add return before res.redirect:
    }
    res.render("listings/show.ejs", { data1 });
}));

//EDIT AND UPDATE ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data2 = await Listing.findById(id);
    if(!data2){
        req.flash("error","Your listing is not present");//any error is there it will show warning like the url you want to check is not present
        return res.redirect("/listings");
    }
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
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    req.flash("error","Listing Deleted!!");
    console.log(deletedata);
    res.redirect("/listings");
}));

module.exports=router;