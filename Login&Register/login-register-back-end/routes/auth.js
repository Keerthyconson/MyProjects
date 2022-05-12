const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const config = require("config");
const { User } = require("../models/users");
const router = express.Router();

// /api/auth
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).send("Invalid email or password");

    // Set the header
    const token = user.generateAuthenticationToken();
    return res.status(200).header("x-auth-token", token).send(token);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email address"),
    password: Joi.string().required().label("Password").min(5),
  });
  return schema.validate(user);
}
module.exports = router;
