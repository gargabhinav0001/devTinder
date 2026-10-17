const mongoose = require("mongoose");
const checkValidator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = "SO_SECRET";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      minLength: [3, "firstname must be at least 3 characters long"],
      maxLength: [50, "firstname must be at most 50 characters long"],
    },
    lastName: {
      type: String,
      require: [true, "lastname is required"],
      minLength: [3, "lastname must be at least 3 characters long"],
      maxLength: [50, "lastname must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // validate: {
      //   validator: (v) => {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid email address!`,
      // },

      // OR

      validate(value) {
        if (!checkValidator.isEmail(value)) {
          throw new Error(`${value} email is not valid `);
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // validate(value) {
      //   if (!checkValidator.isStrongPassword(value)) {
      //     throw new Error("Password is not strong");
      //   }
      // },
    },
    age: { type: Number },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "Enter valid gender i.e. 'male' or 'female' or 'other'",
      },
    },
    photoUrl: { type: String },
    about: { type: String, default: "I am alive!" },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  },
);

/** SCHEMA METHODS */

userSchema.methods.validatePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return !!validPassword;
};

userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, SECRET, {
    expiresIn: 1000,
  });

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

// OR

// module.exports = mongoose.model("User", userSchema);
