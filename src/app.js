const express = require("express");
const mongoose = require("mongoose");
const { connectToDatabase } = require("./config/database.js");
const { userAuthenticate } = require("./middlewares/auth.js");
const { User } = require("./models/user.js");
const PORT = 3000;

const app = express();
app.use(express.json());

/** APIs */

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
