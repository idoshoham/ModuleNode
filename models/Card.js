const { required } = require("joi");
const mongoose = require("mongoose");

const cardSchme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
  },
  address: {
    type: String,
    required: true,
    minlenght: 2,
  },
  description: {
    type: String,
    required: true,
    minlenght: 2,
  },
  phone: {
    type: String,
    required: true,
    minlenght: 9,
    maxlength: 10,
  },
  image: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Card = mongoose.model("cards", cardSchme);
module.exports = { Card };
