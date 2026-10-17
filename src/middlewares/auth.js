const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const SECRET = "SO_SECRET";

async function authenticate(req, cookies) {
  try {
    const { token } = cookies || {};

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
  } catch (err) {
    throw new Error(`ERROR : ${err}`);
  }
}

function adminAuthenticate(req, res, next) {
  const token = "TOKEN";
  const isAdminAuthenticated = token === "TOKEN"; // Replace with your actual authentication logic
  if (!isAdminAuthenticated) {
    return res.status(403).send("Access denied. Admin authentication failed.");
  }
  next();
}
function userAuthenticate(req, res, next) {
  const token = "TOKEN";
  const isUserAuthenticated = token === "TOKEN"; // Replace with your actual authentication logic
  if (!isUserAuthenticated) {
    return res.status(403).send("Access denied. Admin authentication failed.");
  }
  next();
}
module.exports = { adminAuthenticate, userAuthenticate, authenticate };
