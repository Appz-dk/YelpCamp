if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUDINARY_KEY);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// imported routes
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

// Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database connected");
});

// setting app = express()
const app = express();

app.engine("ejs", ejsMate); // telling ejs to use ejsMate to parse
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ## Middle Ware Section ##
// body-parser:
app.use(express.urlencoded({ extended: true })); // to use req.body
// Method override (Put, Delete etc)
app.use(methodOverride("_method"));
// Public Directory
app.use(express.static(path.join(__dirname, "public")));
// Session and session config
const sessionConfig = {
  secret: "thisShouldBeABetterSercet",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // one week in miliseconds
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
// Flash (adding flash method to our req object - req.flash())
app.use(flash());

// Setting up 'Passport' to be used. And specify the user model to be used for autentication.
app.use(passport.initialize());
app.use(passport.session());

// Setting up 'Passport Localstrategy'
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// The info in res.locals is available in all routes and all EJS templates!
app.use((req, res, next) => {
  // will be undefined incase of no user logged in
  res.locals.currentUser = req.user;
  // Flash success message setup
  res.locals.success = req.flash("success");
  // Flash error message setup
  res.locals.error = req.flash("error");
  next();
});

// ## RESTful Routes ##

// home (empty atm)
app.get("/", (req, res) => {
  res.render("home");
});

// ############ Imported routes ############//
// User Routes / Registration
app.use("/", userRoutes);
// Campgrounds routes
app.use("/campgrounds", campgroundRoutes);
// Review Routes
app.use("/campgrounds/:id/reviews", reviewRoutes);

//////////////////
// Page not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});