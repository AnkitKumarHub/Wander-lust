const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewForm = (req, res) => {
  // console.log(req.user);

  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!!");
    res.redirect("/listings");
  }
  // console.log(listing)
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
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
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "...", filename);

  let listing = req.body.listing;
  const newListing = new Listing(listing);

  // Way - 1 but for many fields it will be impossible to check for each individual
  // if (!req.body.listing.title){
  //     throw new ExpressError(400, "title is misssing")
  // }
  // console.log(req.user);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
  // }catch(err){
  //     next(err);
  // }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "send valid data for listing"); // 400 bad request from the client side
  // }
  let { id } = req.params;
  // console.log(id)
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // console.log(req.body.listing)
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};
