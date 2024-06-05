const mongoose = require("mongoose");

const Instauser = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
    },            
    image:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const Instaprofile = mongoose.model("instauser", Instauser);

module.exports = { Instaprofile };
