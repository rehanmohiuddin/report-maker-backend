const mongoose = require("mongoose");

const User = mongoose.Schema({
  passcode: {
    type: String,
    default: process.env.PASSCODE,
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", User);
