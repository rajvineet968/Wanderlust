const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const e = require("connect-flash");
const passport=require("passport");

//SIGNUP PAGE AND STORING USING User.register()
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post('/signup',wrapAsync(async(req,res)=>{//using try and catch block to avoid redudancy of same fields of User Schema Model
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);//register passport-local-mongoose inbuilt function to store in monogdb
        req.login(registeredUser,(err)=>{
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
router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(async (req,res)=>{//password.authenticate as middleware to check if user is already registered
    req.flash("success","Welcome Back to Wanderlust!!");
    res.redirect("/listings");
}))

//LOGOUT PAGE
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","Succesfully Logged out!!");
        res.redirect("/listings");
    })
})

module.exports=router;