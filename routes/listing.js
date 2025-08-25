const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
const Listing = require("../models/listings.js");//requiring model and schema on which datas 
const {isLoggedIn, isOwner, validatelisting} = require("../middleware.js");

//INDEX ROUTE
router.get("/", 
    wrapAsync(async (req, res) => {
    const data = await Listing.find();
    res.render("listings/index.ejs", { data });
    }
));

//NEW AND CREATE ROUTE
router.get("/new", 
    isLoggedIn,
    (req, res) => {
        res.render("listings/new.ejs");
        }
);
router.post("/", 
    isLoggedIn, 
    validatelisting, 
    wrapAsync(async (req, res,next) => {
        const list = new Listing(req.body.listing);
        /* `list.owner=req.user._id;` is assigning the `_id` of the currently logged in user to the
        `owner` field of the `list` object. This is typically done to associate the created listing
        with the user who created it. By setting the `owner` field to the `_id` of the user, you
        establish a relationship between the listing and the user in the database. This can be
        useful for various purposes such as displaying listings created by a specific user,
        implementing authorization checks, and more. */
        list.owner=req.user._id;
        await list.save();
        req.flash("success","New Listing Created!!");
        res.redirect("/listings");
        }
));

//SHOW ROUTE
router.get("/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params; //deconstructing of req.params
        /* `const data1 = await Listing.findById(id).populate("reviews").populate("owner");` is
        fetching a specific listing document from the database based on the provided `id`. */
        const data1 = await Listing.findById(id)./* `populate("reviews").populate("owner")` is a
        Mongoose method used to populate referenced
        documents in a query result. */
        populate({
            path:"reviews",
            populate:{
                path:"author",//nesting populate to populate reviews on basis of reviews->review author
            },
        })
        .populate("owner");
        if(!data1){
            req.flash("error","Your listing is not present");//any error is there it will show warning like the url you want to check is not present
            return res.redirect("/listings");//return is must because it After res.redirect("/listings"), the code will still try to run res.render (which causes "Cannot set headers after they are sent" error sometimes).npm i👉 Fix: add return before res.redirect:
        }
        res.render("listings/show.ejs", { data1 });
        }
));

//EDIT AND UPDATE ROUTE
router.get("/:id/edit",//edit
    isLoggedIn, 
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let data2 = await Listing.findById(id);
        if(!data2){
            req.flash("error","Your listing is not present");//any error is there it will show warning like the url you want to check is not present
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { data2 });
        }
));
router.put("/:id",//update
    isLoggedIn,
    validatelisting,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listings = req.body.listing;
  //    **********OR*********** */
//       await Listing.findByIdAndUpdate(id, {
//         title: listings.title,
//         description: listings.description,
//         image: listings.image,
//         price: listings.price,
//         country: listings.price,
//         country: listings.country,
//         location: listings.location,
//       });
        await Listing.findByIdAndUpdate(id,{...listings});//...listings
        req.flash("success","Listing Updated!!");
        res.redirect(`/listings/${id}`);
        }
));

//DELETE ROUTE
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
        let {id}=req.params;
        let deletedata = await Listing.findByIdAndDelete(id);
        req.flash("error","Listing Deleted!!");
        console.log(deletedata);
        res.redirect("/listings");
        }
));

module.exports=router;