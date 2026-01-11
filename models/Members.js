const mongoose = require("mongoose");

const MembersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Members = mongoose.model("Members", MembersSchema, "bookClub");
module.exports = Members;
