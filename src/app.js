const express = require("express");

const PORT = 3000;

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log("First handler 111");
    // res.send({ firstName: "Abhinav", lastName: "Garg" });
    next();
  },
  (req, res, next) => {
    // next();s
    console.log("Second handlejjr");
    // res.send({ firstName: "2", lastName: "2" });
    // next();
    console.log("third handler");
  },
  // (req, res, next) => {
  //   console.log("third handler");
  //   res.send({ firstName: "3", lastName: "3" });
  // },
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
