const { connectToDatabase } = require("./config/database.js");

const express = require("express");

const PORT = 3000;

const app = express();

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
