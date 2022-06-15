const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// Checks login status
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Storing the URL the 'Login required' was called
    req.session.returnTo = req.originalUrl;

    req.flash("error", "You must be singed in!");
    return res.redirect("/login");
  }
  next();
};

// Serverside Validation middleware for Campgrounds ####
// Adding/Updating campgrounds validation
module.exports.validateCampground = function (req, res, next) {
  // using imported campgroundSchema to validate
  const { error } = campgroundSchema.validate(req.body);
  // Handling errors:
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    // If no error calls next in line
    next();
  }
};

// Serverside Authorisation middleware ####
// Adding/Updating campgrounds validation
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campgound = await Campground.findById(id);
  if (!campgound.author.equals(req.user._id)) {
    req.flash("error", "You do not have premission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Serverside Authorisation middleware ####
// Adding/Updating Review validation
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log(req.params);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have premission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Serverside Validation middleware for Reviews ####
// Adding Reviews validation
module.exports.validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
