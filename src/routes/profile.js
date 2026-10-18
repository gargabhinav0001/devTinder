const express = require("express");
const bcrypt = require("bcrypt");
const { authenticate } = require("../middlewares/auth");
const { User } = require("../models/user");
const { vlidateEditability } = require("../utils/validation");
const { isStrongPassword } = require("validator");

const profileRouter = express.Router();

profileRouter.get("/view", authenticate, async (req, res) => {
  try {
    /** getting attached user from auth middleware */
    res.status(200).send(req.user);
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

profileRouter.patch("/edit", authenticate, async (req, res) => {
  try {
    /** check the incoming req and sanitze the data  */
    const isUpdateAllowed = vlidateEditability(req.body);

    if (!isUpdateAllowed) {
      throw new Error("Invalid data!");
    }

    await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      /** enables schema level validators */
      runValidators: true,
    });

    res.status(200).send("Profile updated successfully!");
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

profileRouter.patch("/edit/password", authenticate, async (req, res) => {
  try {
    /** check the incoming req and sanitze the data  */
    const updatedPassword = req.body.password || "";

    const validPattern = isStrongPassword(updatedPassword);
    if (!validPattern) {
      throw new Error("Password update failed. Need a strong password!");
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    await User.findByIdAndUpdate(
      req.userId,
      { password: encryptedPassword },
      {
        new: true,
        /** enables schema level validators */
        runValidators: true,
      },
    );

    res.status(200).send("Password updated successfully!");
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

module.exports = {
  profileRouter,
};
