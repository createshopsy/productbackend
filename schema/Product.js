const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    description: { type: String, required: true },
    stock: { type: Number, required: true},
    price: { type: Number, required: true},
    image: { type: Array, required: true },
    video: { type: String, required: true },
  },
  { timestamps: true }
);
// productSchema.plugin(mongoosastic);

const products=mongoose.model("products", productSchema);
module.exports={products}

