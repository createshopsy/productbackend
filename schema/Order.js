const mongoose = require("mongoose");

const orderproduct = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
    },

    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const orderitmes = mongoose.model("orderproducts", orderproduct);

module.exports = { orderitmes };
