const express = require("express");

const PORT = 3000;

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello, World! This is a test route.");
});

app.use("/", (req, res) => {
  res.send("Hello, into the world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
