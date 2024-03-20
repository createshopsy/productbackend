const mongoose = require("mongoose");

const sequenceschema = new mongoose.Schema({
  sequence: {
    type: [
      {
        column_name: { type: String },
        display_order: { type: Number },
      },
    ],
    default: [
      { column_name: "username", display_order: 0 },
      { column_name: "firstname", display_order: 1 },
      { column_name: "lastname", display_order: 2 },
      { column_name: "email", display_order: 3 },
      { column_name: "role", display_order: 4 },
    ],
  },
});

module.exports = mongoose.model("sequence", sequenceschema);
