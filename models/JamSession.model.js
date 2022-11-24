const { Schema, model } = require("mongoose");

const jamSessionSchema = new Schema(
  {
    jamSessionName: {
        type: String, 
        trim: true, 
        required: true,
    },
    date: {
        type: Date, 
        required: true,
    },
    capacity: {
        type: Number, 
        required: true, 
    }, 
    genre: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    }
  },
  {
    timestamps: true
  }
);

const JamSession = model("JamSession", jamSessionSchema);

module.exports = JamSession;
