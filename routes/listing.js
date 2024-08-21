const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");


//validate listing as middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };


//Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      // console.log(listing);
      res.render("listings/show.ejs", { listing });
    })
  );
  
  //Create Route
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      //let {title, description, image, price, location, country} = req.body;   //method - 1
  
      // let listing = req.body;
      // console.log(listing);
      // try{
      // if (!req.body.listing) {
      //   throw new ExpressError(400, "send valid data for listing"); // 400 bad request from the client side
      // }
  
      //Way- 2 but used as middleware now
      // let result = listingSchema.validate(req.body);
      // console.log(result);
      // if(result.error){
      //     throw new ExpressError (400, result.error)
      // }
  
      let listing = req.body.listing;
      const newListing = new Listing(listing);
  
      // Way - 1 but for many fields it will be impossible to check for each individual
      // if (!req.body.listing.title){
      //     throw new ExpressError(400, "title is misssing")
      // }
  
      await newListing.save();
      res.redirect("/listings");
      // }catch(err){
      //     next(err);
      // }
    })
  );
  
  //Edit Route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
    })
  );
  
  //Update Route
  router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      // if (!req.body.listing) {
      //   throw new ExpressError(400, "send valid data for listing"); // 400 bad request from the client side
      // }
      let { id } = req.params;
      // console.log(id)
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      // console.log(req.body.listing)
      res.redirect(`/listings/${id}`);
    })
  );
  
  //Delete Route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      // console.log(id);
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
    })
  );


  module.exports = router ;