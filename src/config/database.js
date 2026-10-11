const MONGODB_URI = "DB_URL";

const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose.connect(MONGODB_URI);
}

module.exports = { connectToDatabase };
