const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");

//##################################################//
//############### Campground Routes ################//
//#### All Logic in /controllers/campgrounds.js ####//

// Show All ('campground' is prefixed in the app.js)
router.get("/", catchAsync(campgrounds.index));

// Create / Add new campground (Using isLoggedIn middleware)
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// Show / information about
router.get("/:id", catchAsync(campgrounds.showCampground));

// Update / Edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  isAuthor,
  catchAsync(campgrounds.editCampground)
);

// Delete / Delete a campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.destroyCampground)
);

module.exports = router;
