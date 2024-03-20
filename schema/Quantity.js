const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addcarts",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const productcart = mongoose.model("cartproducts", cartSchema);

module.exports = { productcart };
