const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "firstname must be at least 3 characters long"],
    },
    lastName: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "Password is required"] },
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

const User = mongoose.model("User", userSchema);

module.exports = { User };

// OR

// module.exports = mongoose.model("User", userSchema);
