// Reviews Route

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")





//Post REVIEW route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);  // undefined if mergeaparams is not set to true

    let listing = await Listing.findById(req.params.id);
    // console.log(listing);  // null
    let newReview = new Review(req.body.review);
    // console.log(newReview);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'Review Added successfully!!')

    // res.send("saved!!")
    res.redirect(`/listings/${listing._id}`);
  })
);

//DELETE REVIEW ROUTE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!!')

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
