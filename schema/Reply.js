const mongoose = require("mongoose");

const reply = new mongoose.Schema({
  messageid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "message",
  },
  reply: {
    type: String,
    required: true,
  },
  From: { type: String, ref: "users" },
  To: { type: String, ref: "users" },
});

const replychats = mongoose.model("replychats", reply);

module.exports = { replychats };
