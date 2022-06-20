const { func } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// setting up "imageSchema" and a "thumbnail virtual property"
const imageSchema = new Schema({
  url: String,
  filename: String,
});
// virtual property
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// Schema = mongoose.Schema aka. Schema is now a shorthand version
const CampgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//## Campground delete Middleware ##\\
CampgroundSchema.post("findOneAndDelete", async function (data) {
  // data = the deleted campground's info
  if (data) {
    await Review.deleteMany({
      _id: {
        $in: data.reviews,
      },
    });
  }
});

// exporting
module.exports = mongoose.model("Campground", CampgroundSchema);
