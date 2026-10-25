const MONGODB_URI =
  "mongodb+srv://gargabhinav0001_db_user:Ygqbanm2y7Aani1m@node1.h3wjbqf.mongodb.net/devTinder";

const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose.connect(MONGODB_URI);
}

module.exports = { connectToDatabase };
