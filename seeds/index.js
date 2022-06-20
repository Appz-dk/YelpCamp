const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

// Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// remove everything from Database
const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "62a7678ca9384cff9eab9e3b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ea nobis ipsam sequi cumque, assumenda itaque neque quam nemo deleniti ducimus quibusdam ullam ipsa excepturi dolorum eos fugiat odit debitis! Animi ea iure neque mollitia! Minima aspernatur doloribus ipsa cum, corrupti harum tempora facilis id expedita praesentium voluptatum inventore magnam hic officiis! Consectetur eos facilis dolore beatae aspernatur doloribus veniam.",
      price, // shorthand price = -> price: price
      images: [
        {
          url: "https://res.cloudinary.com/dxkybyqyu/image/upload/v1655739385/YelpCamp/82e2ae94_otenja.jpg",
          filename: "YelpCamp/cea7cmpndnl8qxlcnh2u",
        },
        {
          url: "https://res.cloudinary.com/dxkybyqyu/image/upload/v1655560510/YelpCamp/fnkqtrimnv3h2u8wll8d.jpg",
          filename: "YelpCamp/fnkqtrimnv3h2u8wll8d",
        },
        {
          url: "https://res.cloudinary.com/dxkybyqyu/image/upload/v1655560510/YelpCamp/cwtzu0s6a5rfyxvezy8k.jpg",
          filename: "YelpCamp/cwtzu0s6a5rfyxvezy8k",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
