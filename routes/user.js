const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const e = require("connect-flash");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");//MVC framework : Controllers

//SIGNUP PAGE AND STORING USING User.register()(in line 11 of controllers->users.js)
router.route("/signup")
.get(
    userController.renderSignup,
)
.post(
    wrapAsync(userController.signup)
);

//LOGIN ROUTE
router.route("/login")
.get(
    userController.renderLogin,
)
.post(
    saveRedirectUrl,//middleware
    passport.authenticate(
        "local",
        {failureRedirect:'/login',failureFlash:true}),//passport.authenticate as middleware to check if user is already registered through /signup
        wrapAsync(userController.login)
);

//LOGOUT PAGE
router.get(
    "/logout",
    userController.logout,
);

module.exports=router;