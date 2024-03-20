const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 10,
    },
    firstname: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 10,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },

    password: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);
