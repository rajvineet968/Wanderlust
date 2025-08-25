const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const e = require("connect-flash");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

//SIGNUP PAGE AND STORING USING User.register()(in line 17)
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post('/signup',wrapAsync(async(req,res)=>{//using try and catch block to avoid redudancy of same fields of User Schema Model
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);//register passport-local-mongoose inbuilt function to store in monogdb
        req.login(registeredUser,(err)=>{//.login() inbuilt function of passport
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

//LOGIN PAGE 
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",
    saveRedirectUrl,//middleware
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),//passport.authenticate as middleware to check if user is already registered through /signup
    wrapAsync(async (req,res)=>{
        req.flash("success","Welcome Back to Wanderlust!!");
        /*if we directly click Login from home page so it doesnt trigger isLoggedIn middleware
        so req.session.redirectUrl=req.originalUrl; didnt get triggered hence in chain 
        res.locals.saveUrl=req.session.redirectUrl; didnt get triggered therefore res.locals.saveUrl is undefined 
        hence "Page not found" error will show*/
        let redirecturl=res.locals.saveUrl||"/listings";//using "||" operator to switch between routes
        res.redirect(redirecturl);
}))

//LOGOUT PAGE
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{//.logout() inbuilt function of passport
        if(err){
        return next(err);
        }
        req.flash("success","Succesfully Logged out!!");
        res.redirect("/listings");
    })
})

module.exports=router;