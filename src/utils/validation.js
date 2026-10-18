const validator = require("validator");
const { User } = require("../models/user");

const validateSignupData = (user) => {
  const { email, password } = user;

  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};

const vlidateEditability = (user) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
  ];

  const userFields = Object.keys(user);
  const isEditAllowed = userFields.every((field) =>
    allowedEditFields.includes(field),
  );

  return isEditAllowed;
};

const isValidUser = async (id) => {
  const isUserExists = await User.findOne({ _id: id });
  return !!isUserExists;
};

module.exports = { validateSignupData, vlidateEditability, isValidUser };
