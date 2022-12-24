const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  // Gather the 'Geolocation' to store on campground
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const geoJSON = geoData.body.features[0].geometry;

  // ValidateCampground middleware will check for errors.
  // Adding new campground:
  const campground = new Campground(req.body.campground);
  // Storing Geolocation coordinates to campground.geometry
  campground.geometry = geoJSON;
  // Storing images path and filename to campground.images
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  // Setting author to currently logged in user:
  campground.author = req.user._id;
  await campground.save();
  // setting up flash message for success
  req.flash("success", "Successfully created a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      // nested populate - of review author:
      populate: { path: "author" },
    })
    .populate("author");
  // incase no campground was found
  if (!campground) {
    req.flash("error", "Cannot find that campgound!");
    return res.redirect("/campgrounds");
  }
  // incase campground found
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  // incase no campground was found
  if (!campground) {
    req.flash("error", "Cannot find that campgound!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res, next) => {
  // res.send(req.body);
  // ValidateCampground middleware will check for errors.
  const { id } = req.params;
  // Step 1: Checking Premissions Align:
  // ((step 1 Is now done by the middleware 'isAuthor'))
  // Step 2: Updateing campground:
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
  // Pushing new images to campground.images array
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...imgs);
  // saving
  await campground.save();

  // deleteing images from campground & cloudinary
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyCampground = async (req, res, next) => {
  //   const { id } = req.params;
  await Campground.findByIdAndDelete(req.params.id);

  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
