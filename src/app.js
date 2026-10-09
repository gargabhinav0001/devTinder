const express = require("express");
const { adminAuthenticate, userAuthenticate } = require("./middlewares/auth");

const PORT = 3000;

const app = express();

// one way of handling error is to throw an error in the route handler and catch it in the error handling middleware
app.get("/admin", adminAuthenticate, (req, res) => {
  throw new Error("Admin route error");

  res.send("Admin route accessed successfully.");
});

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// other way is to handle error insie try catch block in the route handler
app.get("/user", userAuthenticate, (req, res) => {
  try {
    throw new Error("User route error");
    res.send("User route accessed successfully.");
  } catch (error) {
    console.error(error.stack);
    res.status(500).send("Something went wrong! in users");
  }
});

// the best way is to use try and catch block and handle the error in current route handler itsef
// but as a fallback we can use error handling middleware to catch any unhandled errors and send a generic error response to the client. This way, we can ensure that our application doesn't crash and provides a consistent error response to the client.
// like below commented code, we can use error handling middleware to catch any unhandled errors and send a generic error response to the client. This way, we can ensure that our application doesn't crash and provides a consistent error response to the client.
// app.use("/", (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
