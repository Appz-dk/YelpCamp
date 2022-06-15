const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema; // to shorthand

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// adding 'passport's username and password' to our UserSchema
// passport-local mongoose will add a username, hash and a salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

// export
module.exports = mongoose.model("User", UserSchema);
