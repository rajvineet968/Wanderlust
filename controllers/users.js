const User=require("../models/user.js");
const e = require("connect-flash");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs")
};
module.exports.signup=async(req,res)=>{//using try and catch block to avoid redudancy of same fields of User Schema Model
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
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async (req,res)=>{
        req.flash("success","Welcome Back to Wanderlust!!");
        /*if we directly click Login from home page so it doesnt trigger isLoggedIn middleware
        so req.session.redirectUrl=req.originalUrl; didnt get triggered hence in chain 
        res.locals.saveUrl=req.session.redirectUrl; didnt get triggered therefore res.locals.saveUrl is undefined 
        hence "Page not found" error will show*/
        let redirecturl=res.locals.saveUrl||"/listings";//using "||" operator to switch between routes
        res.redirect(redirecturl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{//.logout() inbuilt function of passport
        if(err){
        return next(err);
        }
        req.flash("success","Succesfully Logged out!!");
        res.redirect("/listings");
    })
}