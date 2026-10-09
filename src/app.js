const express = require("express");
const { adminAuthenticate, userAuthenticate } = require("./middlewares/auth");

const PORT = 3000;

const app = express();

// we can also use the middleware for specific routes, for example, for the user route
app.get("/user", userAuthenticate, (req, res) => {
  console.log("User route accessed");
  // Logic to handle user request
  res.send("User route accessed successfully");
});

// this is the middleware for all the routes (GET, POST, PUT, DELETE) to handle the request and response for admin
app.use("/admin", adminAuthenticate);

app.get("/admin/getAllUser", (req, res) => {
  console.log("Get all users route accessed");
  // Logic to get all users
  res.send("All users retrieved successfully");
});

app.get("/admin/updateUser", (req, res) => {
  console.log("Update user route accessed");
  // Logic to update a user
  res.send("User updated successfully");
});

app.get("/admin/deleteUser", (req, res) => {
  console.log("Delete user route accessed");
  // Logic to delete a user
  res.send("User deleted successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
