const express = require("express");
// wont work without mergeParams - Because '/:id' is in the app.js file prefixed to the review routes
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

const catchAsync = require("../utils/catchAsync");

//##################################################//
//################ Review Routes ###################//
//#### With "/campgrounds/:id/review" prefixed  ####//

// Review post (with added middleware 'validateReview')
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.destroyReview)
);

module.exports = router;
