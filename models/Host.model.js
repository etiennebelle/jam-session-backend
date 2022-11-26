const { Schema, model } = require("mongoose");

const hostSchema = new Schema(
  {
    barName: {
        type: String, 
        trim: true, 
        required: true,
        unique: true
    },
    address: {
        type: String, 
        trim: true, 
        required: true,
    },
    email: {
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true,
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    jamSessions: [{type: Schema.Types.ObjectId, ref: 'JamSession'}]
  },
  {
    timestamps: true
  }
);

const Host = model("Host", hostSchema);

module.exports = Host;
