const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/users");
const router = express.Router();

// Return current user

// Add new user - POST /api/users
router.post("/", async (req, res) => {
  try {
    // Error in formatting
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already registered
    const { firstName, lastName, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).send("User already registered");

    user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save to database & send result to user
    const result = await user.save();
    const token = user.generateAuthenticationToken();
    return res
      .status(200)
      .send(_.pick(result, ["_id", "email", "firstName", "lastName"]));
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
