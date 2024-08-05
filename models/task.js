const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    done: Boolean,
    // createdBy:
  });

const Task = mongoose.model("Task", taskSchema, "Tasks");

module.exports = {Task};