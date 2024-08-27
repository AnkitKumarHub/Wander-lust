const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  // console.log(req.user);

  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path: "reviews", populate: {path: "author"}})
      .populate("owner");
    // console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!!");
      res.redirect("/listings");
    }
    // console.log(listing)
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
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
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send valid data for listing"); // 400 bad request from the client side
    // }
    let { id } = req.params;
    // console.log(id)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(req.body.listing)
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
  })
);

module.exports = router;
