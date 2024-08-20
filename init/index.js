const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing  = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDb = async () =>{
    await Listing.deleteMany({});  // first we are cleaning the database if any type of data is aready there
    await Listing.insertMany(initData.data);    //then we are initailizing the data with our sample listing  
    console.log("data was initialized");
}


initDb();