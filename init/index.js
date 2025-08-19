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
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("Saved!!")
}

initdb();