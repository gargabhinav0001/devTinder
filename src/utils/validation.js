const validator = require("validator");

const validateSignupData = (user) => {
  const { email, password } = user;

  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};

module.exports = { validateSignupData };
