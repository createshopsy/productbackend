const mongoose = require("mongoose");

const Likes = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instauser",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "postfeed",
    },
  },
  { timestamps: true }
);

const InstaLike = mongoose.model("instalikes", Likes);

module.exports = {InstaLike};
