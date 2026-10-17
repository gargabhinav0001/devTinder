const express = require("express");
const { authenticate } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", authenticate, async (req, res) => {
  try {
    /** getting attached user from auth middleware */
    res.status(200).send(req.user);
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

module.exports = {
  requestRouter,
};
