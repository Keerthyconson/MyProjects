const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();
app.use(express.json());
app.use(cors());
// For authentication, set the jwt web token. We define it as jwtPrivateKey.
// Step 1 : We create the config folder. Add 2 files:
//  a. default.json, b. custom-environment-variables.json
// Step 2 : Create the environment variable in the custom-environment-variables.json-- file
// => login_register_jwtPrivateKey
// Before login export login_register_jwtPrivateKey=keerthy
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR!! jwtPrivateKey is not set");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/login-register-2022")
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

// ENDPOINT
// /api/auth
// /api/users
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
