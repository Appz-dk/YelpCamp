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

// Security
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// imported routes
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

// DATABASE + DB URL
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

// Mongoose
mongoose.connect(dbUrl);

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
// Mongo-Sanitize
app.use(mongoSanitize());
// Session Store in mongoDB setup
const secret = process.env.SECRET || "thisShouldBeABetterSercet";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // in seconds (not milisec)
  crypto: {
    secret,
  },
});
store.on("error", function (e) {
  console.log("Session Store Error!", e);
});
// Session and session config
const sessionConfig = {
  store, // passing in the store above
  name: "session", // set to 'hide' the name atleast a little bit in cookies
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // turned off during localhost
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7, // one week in miliseconds
  },
};
app.use(session(sessionConfig));
// Flash (adding flash method to our req object - req.flash())
app.use(flash());

// adding more security with 'helmet'
// Helmet options
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxkybyqyu/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dxkybyqyu/",
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/dxkybyqyu/",
];
const fontSrcUrls = ["https://res.cloudinary.com/dxkybyqyu/"];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/dxkybyqyu/",
          "https://images.unsplash.com/",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
        mediaSrc: ["https://res.cloudinary.com/dxkybyqyu/"],
        childSrc: ["blob:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

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
