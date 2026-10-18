const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connection");

const userRouter = express.Router();

// GET ALL PENDING CONNECTION REQUEST FOR THE LOGGED IN USER
userRouter.get("/requests/received", authenticate, async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: req.userId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.send({
      status: 200,
      message: "Pending requests retrieved successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.send({
      status: 400,
      message: err.message || "Something went wrong!",
    });
  }
});

userRouter.get("/connections", authenticate, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
      status: "accepted",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    res.send({
      status: 200,
      message: "Fetched all connections succussfully!",
      data: connections,
    });
  } catch (err) {
    res.send({
      status: 400,
      message: err.message || "Something went wrong!",
    });
  }
});

module.exports = {
  userRouter,
};
