const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connection");
const { User } = require("../models/user");

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

    const data = connections.map((connection) => {
      if (connection.fromUserId.toString() === req.userId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.send({
      status: 200,
      message: "Fetched all connections succussfully!",
      data: data,
    });
  } catch (err) {
    res.send({
      status: 400,
      message: err.message || "Something went wrong!",
    });
  }
});

// feed ? page = 1 & limit = 10
userRouter.get("/feed", authenticate, async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    // restricting max user per page
    limit = limit > 50 ? 50 : limit;

    /** No of document to skip */
    const skip = (page - 1) * limit;

    // users those had not send any type of request to me other than 'interested' and
    // those users to whom I had not sent any type of request
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: req.userId },
        {
          toUserId: req.userId,
          /** if sender is interested in me, so SENDER should be visible in the feed
           * THIS LOGIC WILL HELP -> IT'S A MATCH FEATURE */
          status: {
            $ne: "interested",
          },
        },
      ],
    }).select(["fromUserId", "toUserId"]);

    const hideUsersFromFeed = new Set();

    connections.forEach((connection) => {
      hideUsersFromFeed.add(connection.toUserId);
      hideUsersFromFeed.add(connection.fromUserId);
    });

    const usersToShowInFeed = await User.find({
      $and: [
        {
          _id: {
            // IMP : not in operator
            $nin: [...hideUsersFromFeed],
          },
        },
        // edge case : i have to neglect my id too
        {
          _id: {
            $ne: req.userId,
          },
        },
      ],
    })
      .select(["firstName", "lastName", "about", "skills", "not"])
      /** funcitons for PAGINATION */
      .skip(skip)
      .limit(limit);

    res.send({
      status: 200,
      message: "Fetched feed successfully!",
      data: usersToShowInFeed,
    });
  } catch (err) {
    res.send({
      status: 400,
      messager: err.message || "Something went wrong!",
    });
  }
});

module.exports = {
  userRouter,
};
