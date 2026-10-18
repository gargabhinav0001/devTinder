const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const SECRET = "SO_SECRET";

async function authenticate(req, res, next) {
  try {
    console.log("cookies : ", req.cookies);
    const { token } = req?.cookies || {};

    if (!token) {
      throw new Error("Invalid Token !");
    }

    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken) {
      throw new Error("Invalid Credentials!");
    }

    const { _id } = decodedToken;

    // if user exists in our system
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid request!");
    }

    req.userId = _id;
    req.user = user;
    next();
  } catch (err) {
    res.send(`ERROR : ${err}`);
  }
}

module.exports = { authenticate };
