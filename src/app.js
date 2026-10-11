const express = require("express");
const mongoose = require("mongoose");
const { connectToDatabase } = require("./config/database.js");
const { User } = require("./models/user.js");
const PORT = 3000;

const app = express();

/** work for all the routes. express.json() is a express middleware */
app.use(express.json());

/** APIs */

/** AUTH */
app.post("/signup", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
  });

  await newUser
    .save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

/** USER */

/** get a user */
app.get("/user", async (req, res) => {
  const { email } = req.body;

  try {
    const updatedUser = await User.findOne({ email: email });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all users with a specific email
app.get("/users", async (req, res) => {
  const userEmail = req.body.email;
  await User.find({ email: userEmail })
    .then((user) => {
      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

// get user by id

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** FEED */
app.get("/feed", async (req, res) => {
  /** get all users */
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.send({ message: "No users found", status: 404 });
    }
    res.send({ users, status: 200 });
  } catch (err) {
    res.send({ error: err.message, status: 400 });
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
