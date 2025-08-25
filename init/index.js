const mongoose=require("mongoose");
const initdata=require("./data.js")
const listing=require("../models/listings.js")

const MONGOURL="mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connection successfull!!!");
    })
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGOURL);
}

const initdb=async()=>{
    await listing.deleteMany({});//It will empty all the data before adding into mongodb
    /* This code snippet is using the `map` function to iterate over each object in the `initdata.data`
    array. For each object, it is creating a new object using the spread syntax `{...obj}` to copy
    all the key-value pairs (properties) from the original object `obj`. */
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68a96e7def78065e01d94699"}));//...obj takes all the key-value pairs (properties) from the object obj and puts them inside a new object.
    /*You take every object inside initdata.data
    Copy all its properties using ...obj
    Add a new field owner to it. */
    await listing.insertMany(initdata.data);
    console.log("Saved!!")
}

initdb();