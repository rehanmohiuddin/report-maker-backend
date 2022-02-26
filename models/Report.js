const mongoose = require("mongoose");

const Section = mongoose.Schema({
  name: String,
  description: String,
  graphData: [Object],
  additionalData: Object,
  media: [Object],
});
const Report = mongoose.Schema({
  sections: [Section],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Report", Report);
