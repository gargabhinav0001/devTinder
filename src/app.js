const express = require("express");
const cookiePraser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("./config/database.js");
const { User } = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const { authenticate } = require("./middlewares/auth.js");

const PORT = 3000;

const app = express();

/** work for all the routes. express.json() is a express middleware */
app.use(express.json());
/** to parse incoming cookies */
app.use(cookiePraser());

const SECRET = "SO_SECRET";

/** APIs */

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    if (!(req.body.password.length >= 8 && req.body.password.length <= 50)) {
      throw new Error("Length of password should be between 8-50 characters");
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword,
    });

    validateSignupData(newUser);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    if (!(req.body.password.length >= 8 && req.body.password.length <= 50)) {
      throw new Error("Length of password should be between 8-50 characters");
    }

    const { email, password } = req.body;

    // check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      /** do not expose whether the user exists or not
       * throw invalid cred error
       */
      // throw new Error("User not exists!");
      throw new Error("Invalid credentials!");
    }

    // if user is exists -> now validate password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Invalid credentials!");
    }

    // if validaion succeeds, set token

    const token = jwt.sign({ _id: user._id }, SECRET, {
      expiresIn: 1000,
    });

    res.cookie("token", token);
    res.send({
      status: 200,
      message: "User logged in successfully!",
    });
  } catch (err) {
    res.send({
      error: 400,
      message: err.message,
    });
  }
});

// ******** AUTH MIDDLEWARE *********

app.use("/", async (req, res, next) => {
  try {
    await authenticate(req, req.cookies);
    next();
  } catch (err) {
    res.send({
      status: err.status || 400,
      message: err.message,
    });
  }
});

// **********************************

/** PROFILE */
app.get("/profile", async (req, res) => {
  try {
    /** getting attached user from auth middleware */
    res.status(200).send(req.user);
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

/** Connect to Database and start server */
try {
  async function connectDatabaseAndStartServer() {
    await connectToDatabase();
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  connectDatabaseAndStartServer();
} catch (err) {
  console.error("Error starting server:", err);
}
