const mongoose = require("mongoose");

const Followuser = new mongoose.Schema({
  following:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "instauser",
  },
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instauser",
  },
});

const Follow = mongoose.model("follower", Followuser);
module.exports = { Follow };
