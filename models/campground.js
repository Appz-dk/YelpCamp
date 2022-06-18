const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// Schema = mongoose.Schema aka. Schema is now a shorthand version
const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
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
