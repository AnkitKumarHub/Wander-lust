const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        reuired: true
    },
    description: String,
    image: {
        type: String,
        //setting default value if there is no url of image value is undefined , null , not exist
        default: "https://plus.unsplash.com/premium_photo-1682377521625-c656fc1ff3e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,

        //and this condition is for when image is there but link is empty 
        set: (v) => v==="" 
        ? "https://plus.unsplash.com/premium_photo-1682377521625-c656fc1ff3e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        : v,  
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;