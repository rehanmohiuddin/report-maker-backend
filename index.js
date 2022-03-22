const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
const User = require("./models/Auth");
const reportRoute = require("./routes");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("CONNECTED"))
  .catch((err) => console.error(err));

app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use("/", reportRoute);

app.get("/", (req, res) => {
  res.send(" API");
});

server.listen(process.env.PORT, () => {
  console.log("Server Started At Port : " + process.env.PORT);
});
