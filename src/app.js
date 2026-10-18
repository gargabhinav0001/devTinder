const express = require("express");
const cookiePraser = require("cookie-parser");
const { connectToDatabase } = require("./config/database.js");

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");

const PORT = 3000;

const app = express();

/** work for all the routes. express.json() is a express middleware */
app.use(express.json());
/** to parse incoming cookies */
app.use(cookiePraser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/connectionRequest", requestRouter);

// fallback
app.use("/", (_req, res) => {
  res.send({
    status: 404,
    message: "Not Found!",
  });
});

try {
  /** Connect to Database and start server */
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
