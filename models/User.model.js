const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
