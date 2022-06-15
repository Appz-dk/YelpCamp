const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const User = require("../models/user");
// controller
const users = require("../controllers/users");

// using router.route to set routes for a specefic path fx for all "/register" or all "/login" routes. And then chaining on the 'get', 'post', 'put' etc.

// register
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

// Login
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    users.login
  );

// Logout route
router.get("/logout", users.logout);

module.exports = router;
