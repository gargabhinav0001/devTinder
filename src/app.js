const express = require("express");

const PORT = 3000;

const app = express();

// this is the middleware for all the routes (GET, POST, PUT, DELETE) to handle the request and response for admin
app.use("/admin", (req, res, next) => {
  // Middleware logic for admin routes
  const token = "TOKEN";
  const isAdminAuthenticated = token === "TOKN"; // Replace with your actual authentication logic
  if (!isAdminAuthenticated) {
    return res.status(403).send("Access denied. Admin authentication failed.");
  }
  next();
});

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
