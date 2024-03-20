const mongoose = require("mongoose");

const cartAddSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Cartadd = mongoose.model("Carts", cartAddSchema);

module.exports = { Cartadd };
