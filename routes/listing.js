const express=require("express");
const router=express.Router();

//MULTER package for image uploading back to backend 
const multer  = require('multer')//requiring multer
const {storage}=require("../cloudConfig.js");//requiring storage for saving files (NOTE: MUST BE BEFORE const upload = multer({ dest: 'uploads/' }))
const upload = multer({ storage })//initializing multer and change the name to 'storage'

const wrapAsync=require("../utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
// const Listing = require("../models/listings.js");//requiring model and schema on which datas 
const {isLoggedIn, isOwner, validatelisting} = require("../middleware.js");

const listingController=require("../controllers/listings.js");//MVC framework : Controllers    (listingController is variable name: Dont think I had imported this file from controllers)

router.route("/")//Combining all routes with same route
.get(//INDEX ROUTE
    wrapAsync(listingController.index)//we have listingController as required from controllers folder i.e. listings.js thats why index is method within listingController
)
.post( //CREATE ROUTE
    isLoggedIn, //user is logged or not
    validatelisting,
    upload.single('listing[image]'), //we will upload a single image to backend cloudinary(3rd party cloud server) with name="listing[image]"
    wrapAsync(listingController.createListing),
);

//NEW ROUTE MUST Be Before SHOW AND UPDATE ROUTE,DESROY ROUTE
router.get(
    "/new", 
    isLoggedIn,
    listingController.renderNewForm,
);

router.route("/:id")
.get(
    wrapAsync(listingController.showListing)//SHOW ROUTE
)
.put(//UPDATE ROUTE
    isLoggedIn,
    validatelisting,
    upload.single('listing[image]'), //we will upload a single image to backend cloudinary(3rd party cloud server) with name="listing[image]"
    wrapAsync(listingController.updateListing)
)
.delete(//DESTROY ROUTE
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

//EDIT ROUTE
router.get(
    "/:id/edit",//edit
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports=router;