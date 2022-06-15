const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  // finding the campground
  const campground = await Campground.findById(id);
  // Creating the review from input info
  const review = new Review(req.body.review);
  // Setting 'logged in user id' to the 'Author'
  review.author = req.user._id;
  //'review' info into 'reviews' array in the Campground database
  campground.reviews.push(review); // push or unshift ??
  // saving
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // deleteing review referance from Campground
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // deleting review
  await Review.findByIdAndDelete(reviewId);
  // redirecting to the campground show page
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
