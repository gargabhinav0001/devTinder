const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    if (!(req.body.password.length >= 8 && req.body.password.length <= 50)) {
      throw new Error("Length of password should be between 8-50 characters");
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    /** data sanitization */
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

authRouter.post("/login", async (req, res) => {
  try {
    if (!(req.body.password.length >= 8 && req.body.password.length <= 50)) {
      throw new Error("Length of password should be between 8-50 characters");
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      /** do not expose whether the user exists or not
       * throw invalid cred error
       */
      // throw new Error("User not exists!");
      throw new Error("Invalid credentials!");
    }

    const validUser = await user.validatePassword(password);

    if (!validUser) {
      /** do not expose whether the user exists or not
       * throw invalid cred error
       */
      // throw new Error("User not exists!");
      throw new Error("Invalid credentials!");
    }

    // offloading JWT creation to schema mothods
    const token = await user.getJWT();

    // if validaion succeeds, set token
    res.cookie("token", token);

    res.send({
      status: 200,
      message: "User logged in successfully!",
      data: user,
    });
  } catch (err) {
    /** clear exisitng cookie on invalid login */
    res.clearCookie("token");
    res.send({
      error: 400,
      message: err.message,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      path: "/", // Ensure this matches the path used when the cookie was created
    });

    res.send("User logout successfully!");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = {
  authRouter,
};
