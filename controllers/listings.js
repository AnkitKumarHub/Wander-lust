const Listing = require("../models/listing.js");


function geocodeAndAddMarker(address) {
  var geocoder = platform.getGeocodingService();
  geocoder.geocode(
    { searchText: address },
    function(result) {
      if (result.Response.View.length > 0) {
        var location = result.Response.View[0].Result[0].Location.DisplayPosition;
        addMarkerToMap(location.Latitude, location.Longitude);
      } else {
        console.log('No results found for the address:', address);
      }
    },
    function(e) {
      console.log('Error while geocoding:', e);
    }
  );
}


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.rendernewForm = (req, res) => {
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

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300")
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "send valid data for listing"); // 400 bad request from the client side
  // }
  let { id } = req.params;
  // console.log(id)
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // console.log(req.body.listing)

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};


//**** */

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};



//!--------------------------------------------------
module.exports.filterListings = async (req, res, next) => {
  const { q } = req.params;
  const filteredListings = await Listing.find({category: q }).exec();
  if (!filteredListings.length) {
      req.flash("error", "No Listings exists for this filter!");
      res.redirect("/listings");
      return;
  }
  res.locals.success = `Listings Filtered by ${q}`;
  res.render("listings/index.ejs", { allListings: filteredListings });
}

module.exports.search = async(req, res) => {
  console.log(req.query.q);
  let input = req.query.q.trim().replace(/\s+/g, " "); //remove start and end space
  console.log(input);
  if(input == "" || input == " "){
      //search value is empty
      req.flash("error", "Search value empty!!!");
      res.redirect("/listings");
  }

  //convert every word first letter capital and other small
  let data = input.split("");
  let element = "";
  let flag = false;
  for(let index = 0; index < data.length; index++) {
      if (index == 0 || flag) {
          element = element + data[index].toUpperCase();
      } else {
          element = element + data[index].toLowerCase();
      }
      flag = data[index] == " ";
  }
  console.log(element);

  let allListings = await Listing.find({
      title: { $regex: element, $options: "i"},
  });
  if(allListings.length !=0 ){
      res.locals.success = "Listings searched by title";
      res.render("listings/index.ejs", {allListings});
      return;
  }
  if(allListings.length == 0){
      allListings = await Listing.find({
          category: { $regex: element, $options: "i"},
      }).sort({_id: -1});
      if(allListings.length != 0) {
          res.locals.success = "Listings searched by category";
          res.render("listings/index.ejs", {allListings});
          return;
      }
  }
  if(allListings.length == 0) {
      allListings = await Listing.find({
          country: { $regex: element, $options: "i"},
      }).sort({_id: -1});
      if(allListings.length != 0) {
          res.locals.success = "Listings searched by country";
          res.render("listings/index.ejs", {allListings});
          return;
      }
  }
  if(allListings.length == 0) {
      allListings = await Listing.find({
          location: { $regex: element, $options: "i"},
      }).sort({_id: -1});
      if(allListings.length != 0) {
          res.locals.success = "Listings searched by location";
          res.render("listings/index.ejs", {allListings});
          return;
      }
  }

  const intValue = parseInt(element, 10); //10 for decimal return - int ya NaN
  const intDec = Number.isInteger(intValue); //check intValue is number or not

  if(allListings.length == 0 && intDec) {
      allListings = await Listing.find({ price: { $lte: element }}).sort({
          price: 1,
      });
      if(allListings.length != 0) {
          res.locals.success = `Listings searched for less than Rs ${element}`;
          res.render("listings/index.ejs", { allListings });
          return;
      }
  }
  if(allListings.length == 0) {
      req.flash("error", "Listings is not here !!!");
      res.redirect("/listings");
  }
}
