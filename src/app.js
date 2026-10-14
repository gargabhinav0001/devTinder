const express = require("express");
const { connectToDatabase } = require("./config/database.js");
const { User } = require("./models/user.js");
const PORT = 3000;

const app = express();

/** work for all the routes. express.json() is a express middleware */
app.use(express.json());

/** APIs */

/** AUTH */
app.post(
  "/signup",
  (req, res, next) => {
    const data = req.body;

    // ADD API LEVEL DATA SANITIZATION AND VALIDADTION
    /**
     * when reqest comes from api, it has to be sanitized so that only the
     * data i.e. required will go to DB
     */
    const Allowed_Data = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "email",
      "password",
    ];

    const validData = Object.keys(data).every((k) => Allowed_Data.includes(k));
    if (!validData) {
      res.status(400).json({
        message: "Data is not valid!",
      });
    } else {
      next();
    }
  },
  async (req, res) => {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      gender: req.body.gender,
    });
    try {
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

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

/** delete user */

app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    // const deletedUser = await User.findByIdAndDelete(userId);
    const deletedUser = await User.findByIdAndDelete({ _id: userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** patch user */

app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** Update user by email */
app.patch("/user/email/:email", async (req, res) => {
  const userEmail = req.params.email;
  const updateData = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail }, // condition to find the user by email
      updateData,
      {
        returnDocument: "after",
      },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
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
