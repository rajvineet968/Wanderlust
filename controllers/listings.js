const Listing = require("../models/listings.js");//requiring model and schema on which datas 
module.exports.index=async (req, res) => {
    const data = await Listing.find();
    res.render("listings/index.ejs", { data });
    };

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
    };
module.exports.createListing=async (req, res,next) => {
    let url=req.file.path;/* asking for filename and url from req.file */
    let {filename} = req.file;
    const list = new Listing(req.body.listing);
    /* `list.owner=req.user._id;` is assigning the `_id` of the currently logged in user to the
    `owner` field of the `list` object. This is typically done to associate the created listing
    with the user who created it. By setting the `owner` field to the `_id` of the user, you
    establish a relationship between the listing and the user in the database. This can be
    useful for various purposes such as displaying listings created by a specific user,
    implementing authorization checks, and more. */
    list.owner=req.user._id;
    list.image={url,filename};//saving url and filename to image object in listings.js model

    // Geocode location using OpenStreetMap (Nominatim API)
    const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(list.location)}`
    );
    const geoData = await geoRes.json();
    if (geoData.length > 0) {
        list.latitude = geoData[0].lat;
        list.longitude = geoData[0].lon;
    } else {
        req.flash("error", "Location not found, please enter a valid address.");
        return res.redirect("/listings/new");
    }
    
    await list.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
    };

module.exports.showListing=async (req, res) => {
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
    };

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let data2 = await Listing.findById(id);
    if(!data2){
        req.flash("error","Your listing is not present");//any error is there it will show warning like the url you want to check is not present
        return res.redirect("/listings");
    }
    let imageOriginalUrl=data2.image.url;
    imageOriginalUrl=imageOriginalUrl.replace("/upload","/upload/w_250")//reducing pixels of image preview
    res.render("listings/edit.ejs", { data2 ,imageOriginalUrl });
    }
module.exports.updateListing=async (req, res) => {
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
    //what we did here is that first we update (if did any changes) all the datas excpet file .
    let list=await Listing.findByIdAndUpdate(id,{...listings});//...listings
    
    if(typeof req.file!="undefined"){//if req.file exists then onyl update image
        //then we will add image :{url,filename } to list which got updated just now
        let url=req.file.path;/* asking for filename and url from req.file */
        let {filename} = req.file;
        list.image={url,filename};
        await list.save();//again updating(saving) image 
    }

    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
    };

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    req.flash("error","Listing Deleted!!");
    console.log(deletedata);
    res.redirect("/listings");
    }