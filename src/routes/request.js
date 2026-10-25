const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connection");
const { isValidUser } = require("../utils/validation");

const requestRouter = express.Router();

requestRouter.post(
  "/send/:status/:toUserId",
  authenticate,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;

      const allowedStatuses = ["interested", "ignored"];
      const allowedOperation = allowedStatuses.includes(status);

      if (!allowedOperation) {
        throw new Error("Invalid Connection Request!");
      }

      const loggedInUserId = req.userId;

      //** if user send request to himself */
      // if (loggedInUserId === toUserId) {
      //   res.send({
      //     status: 400,
      //     message: "Invalid request!",
      //   });
      //   return;
      // }

      //OR you can use 'PRE' middleware to check/validate

      /** check the validity of the target user */
      const isTargetUserValid = await isValidUser(toUserId);

      if (!isTargetUserValid) {
        throw new Error("Target user is not a valid user!");
      }

      /** handling duplicate connect requests */
      const isExistingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: loggedInUserId, toUserId: toUserId, active: true },
          { fromUserId: toUserId, toUserId: loggedInUserId, active: true },
        ],
      });

      if (isExistingConnection) {
        res.send({
          status: 400,
          messag: "Connect request already exists!",
        });
        return;
      }

      const newConnection = new ConnectionRequest({
        fromUserId: loggedInUserId,
        toUserId: toUserId,
        status: status,
        active: true,
      });

      await ConnectionRequest.create(newConnection);

      res.send({
        status: 200,
        message: "Connection request sent successfully!",
      });
    } catch (err) {
      res.status(400).send(`ERROR : ${err.message}`);
    }
  },
);

requestRouter.patch(
  "/review/:status/:requestId",
  authenticate,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      const isAllowedStatus = allowedStatus.includes(status);

      if (!isAllowedStatus) {
        throw new Error("Invalid request!");
      }

      const connectionRequest = await ConnectionRequest.findOneAndUpdate(
        {
          _id: requestId,
          /** Checking : only receiver should be the acceptor or rejector */
          toUserId: req.userId,
          status: "interested",
        },
        {
          status,
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

      if (!connectionRequest) {
        throw new Error("Invalid Connection Request!");
      }

      res.send({
        status: 200,
        message: "Request is acknowledged!",
        data: connectionRequest,
      });
    } catch (err) {
      res.send({
        status: 400,
        message: err.message,
      });
    }
  },
);

module.exports = {
  requestRouter,
};
