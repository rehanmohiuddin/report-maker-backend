const getWeekDay = (day) =>
  [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ][day - 1];

module.exports = { getWeekDay };
