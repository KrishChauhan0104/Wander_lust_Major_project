const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} =  require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReveiwAuthor } = require("../middleware.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
   
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(","); 
      throw new ExpressionError(400, result.error);
    }
    else {
      next();
    }
  };

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
   
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
  
   
    res.redirect(`/listings/${listing._id}`);
  
  }));
  
  //delete review
  
  router.delete("/:reviewId", isLoggedIn, isReveiwAuthor, wrapAsync(async (req, res) => {
     let {id, reviewId} = req.params;
     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted");
  
     res.redirect(`/listings/${id}`);
  }));

  module.exports = router;