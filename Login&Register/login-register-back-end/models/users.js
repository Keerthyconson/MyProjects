const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
});

userSchema.methods.generateAuthenticationToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Lastname"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(5)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Password"),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
