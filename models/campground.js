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

// CampgroundSchema options (to include virtuals in JSON.stringify)
const opts = { toJSON: { virtuals: true } };
// Schema = mongoose.Schema aka. Schema is now a shorthand version
const CampgroundSchema = new Schema(
  {
    title: String,
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
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers
        required: true,
      },
    },
  },
  opts
);
// Campground virtual property
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 50)}...</p>`;
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
