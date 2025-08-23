const express = require("express");//requiring express
const app = express();

//using authentication and authorization
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");//acquiring user model


/* `app.set("view engine", "ejs");` is setting the view engine for the Express application to EJS
(Embedded JavaScript). This means that when rendering views in your application, Express will use
EJS to process and render the templates. EJS allows you to embed JavaScript code within your HTML
templates, making it easier to generate dynamic content on the server side before sending it to the
client. */
app.set("view engine", "ejs");

/* The line `const listings=require("./routes/listing.js");//requiring listing routes` is requiring and
importing the module located at "./routes/listing.js" into the variable `listings`. This module
likely contains the routes and logic related to handling listings in the Express application. By
requiring this module, the routes and functionality defined in "listing.js" can be used within the
main Express application to handle requests related to listings. */
const listingRouter=require("./routes/listing.js");//requiring listing routes

/* The line `const reviews=require("./routes/review.js");` is requiring and importing the module
located at "./routes/review.js" into the variable `reviews`. This module likely contains the routes
and logic related to handling reviews in the Express application. By requiring this module, the
routes and functionality defined in "review.js" can be used within the main Express application to
handle requests related to reviews. */
const reviewRouter=require("./routes/review.js");//requiring review routes

/* The line `const user=require("./routes/user.js");` is requiring and importing the module located at
"./routes/user.js" into the variable `user`. This module likely contains the routes and logic
related to handling user-related functionalities in the Express application. By requiring this
module, the routes and functionality defined in "user.js" can be used within the main Express
application to handle requests related to users, such as user authentication, registration, profile
management, etc. */
const userRouter=require("./routes/user.js");

//Home Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});


//Session requiring
const session=require('express-session');
const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*3,
    httpOnly:true,
  },
}
app.use(session(sessionOptions));

//requiring connect-flash after app.use(session(sessionOptions));
const flash=require('connect-flash');
app.use(flash());

//using passport after app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// use static authenticate method of model in LocalStrategy
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//after adding one list it shows a flash
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

const port = 8080;
//Listening
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const mongoose = require("mongoose");//for connecting mongoDb
// const Listing = require("./models/listings.js");//requiring model and schema on which datas 
// const Review=require("./models/review.js");//requiring  model and schema for reviews 
const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";
//Connection to MongoDB
main()
  .then(() => {
    console.log("Connection successfull to DB!!!");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGOURL);
}

const path = require("path");//to connect path of backend to views,public folder for ejs and css,js files respectively
app.set("views", path.join(__dirname, "views")); //ejs files
app.use(express.static(path.join(__dirname, "public"))); //css,html files

const methodOverride = require("method-override");//converting one method to other method because <form></form> elements only allow method="GET/PUT"
app.use(methodOverride("_method")); //using methodoverride

const ejsMate=require("ejs-mate");//for using navbar and footer in boilerplate ejs to avoid redudancy
app.engine('ejs', ejsMate);// use ejs-locals for all ejs templates:

// const wrapAsync=require("./utils/wrapAsync.js");//wrapAysnc to throw error to error handling middlewares
const ExpressError=require("./utils/ExpressError.js");//requiring expresseroor to print expected error and message

// const {listing,review}=require("./schema.js");//requiring Joi for server side validation (not mongoose validations)

//middlewares to deconstruct/use "POST" method body and params({extended : true} for acquiring objects(less load check in EDIT AND UPDATE ROUTE)  and {encoded : true} for acquiring normal datas(more load))
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

/* `app.use("/listings", listings);` is setting up a middleware in the Express application. This
middleware is specifying that any requests that start with the path "/listings" should be handled by
the `listings` router. */
app.use("/listings",listingRouter);

/* The line `app.use('/listings/:id/reviews', reviews);` is setting up a middleware in the Express
application. This middleware is specifying that any requests that match the pattern
"/listings/:id/reviews" should be handled by the `reviews` router. */
app.use('/listings/:id/reviews',reviewRouter);

app.use("/",userRouter);
// if by mistakely jumps into other page
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not Found!!"));//we can send error to error middlewares
})
//custom error handler middleware
app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong!!"}=err;
  res.status(status).render("listings/error.ejs",{err})
})


