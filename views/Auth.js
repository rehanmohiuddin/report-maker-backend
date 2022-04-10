require("dotenv").config();
var jwt = require("jsonwebtoken");

const auth = (req, res) => {
  try {
    const { password } = req.body;
    if (password === process.env.PASSCODE) {
      console.log({ password });

      const token = jwt.sign(
        { email: process.env.EMAIL },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        token: token,
        email: process.env.EMAIL,
      });
    } else {
      res.status(401).json({
        message: "Invalid User",
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const checkAuth = (req, res) => {
  try {
    const { token } = req.query;
    console.log({ token });
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    if (verify.email === process.env.EMAIL) {
      const token = jwt.sign(
        { email: process.env.EMAIL },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        token: token,
        email: process.env.EMAIL,
      });
    } else {
      res.status(401).json({
        message: "Invalid User",
      });
    }
  } catch (e) {
    res.status(500).send({
      message: e.toString(),
    });
  }
};

module.exports = {
  auth: auth,
  checkAuth: checkAuth,
};
