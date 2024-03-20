const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    address: {
      city: { type: String },
      country: { type: String },
      line1: { type: String },
      line2: { type: String },
      postal_code: { type: String },
      state: { type: String },
    },
    metadata: {
      type: String,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };
