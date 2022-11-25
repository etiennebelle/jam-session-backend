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
    time: {
        type: String, 
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
    }, 
    image: {
        type: String, 
        required: true
    }, 
    host: {type: Schema.Types.ObjectId, ref: 'Host'}
  },
  {
    timestamps: true
  }
);

const JamSession = model("JamSession", jamSessionSchema);

module.exports = JamSession;
