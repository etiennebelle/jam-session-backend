const mongoose = require('mongoose'); 
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    instrument: {
      type: [String],
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
