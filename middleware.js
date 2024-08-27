const Listing = require("./models/listing")
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req, "..", req.path, "..", req.originalUrl)
  if (!req.isAuthenticated()) {
    //redirect url save
    // console.log(req.session);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};

//bydefault the passport after login clears the req.session wich means it will contain undefined so we are saving the req.session.redirect to our locals and passport does not have the authority to delete it(locals)
module.exports.saveRedirectUrl =(req,res,next)=>{
  if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

//validate listing as middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validate review as middleware
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//to check the owner 
module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
    // console.log(id)
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have the authorized permission!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}


//to check the author of the review and provide delete 
module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id, reviewId } = req.params;
    // console.log(id)
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have the authorized permission!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

