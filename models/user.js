const { required } = require("joi");
const mongoose=require("mongoose");//requiring mongoose
const Schema=mongoose.Schema;//intitalized schema so it will be helpful as short form for writing more schemas
const passportLocalMongoose = require('passport-local-mongoose');//requiring passport-local mongoose

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);