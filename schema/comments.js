const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instauser",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postfeed",
  },
  comment: {
    type: String,
  },
});

const InstaComment = mongoose.model("comment", Comment);
module.exports = { InstaComment };
