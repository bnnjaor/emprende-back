const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definir esquema de usuarios


const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  login_code: String,
});

const User = mongoose.model("User", userSchema, "Users");

module.exports = {User};
