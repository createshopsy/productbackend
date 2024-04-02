const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    description: { type: String, required: true },
    stock: { type: Number, required: true},
    price: { type: Number, required: true},
    image: { type: Array, required: true },
    video: { type: Array, required: true },
  },
  { timestamps: true }
);


const products=mongoose.model("products", productSchema);
module.exports={products}

