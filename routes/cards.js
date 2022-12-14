const express = require("express");
const { Card } = require("../models/Card");
const joi = require("joi");
const _ = require("lodash");
const auth = require("../middlewares/auth");

const router = express.Router();

const cardScheme = joi.object({
  name: joi.string().required().min(2),
  address: joi.string().required().min(2),
  description: joi.string().required().min(2),
  phone: joi
    .string()
    .required()
    .regex(/^0[2-9]\d{7,8}$/),
  image: joi.string().required(),
});

const genCardNumber = async () => {
  while (true) {
    let randomNum = _.random(1000, 999999);
    let card = await Card.findOne({ cardNumber: randomNum });
    if (!card) return randomNum;
  }
};

router.post("/", auth, async (req, res) => {
  try {
    const { error } = cardScheme.validate(req.body);
    if (error) return res.status(400).send(error.message);
    let card = new Card(req.body);
    card.cardNumber = await genCardNumber();
    card.user_id = req.payload._id;
    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("Error in post card");
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const myCards = await Card.find({ user_id: req.payload._id });
    if (myCards.length === 0) return res.status(404).send("There no cards");
    res.status(200).send(myCards);
  } catch (error) {
    res.status(400).send("Error in get user cards");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params.id,
      user_id: req.payload._id,
    });

    if (!card) return res.status(404).send("Card was not found");
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("Error in get specific card");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = cardScheme.validate(req.body);
    if (error) return res.status(400).send(error.message);
    let card = await Card.findByIdAndUpdate(
      { _id: req.params.id, user_id: req.payload._id },
      req.body,
      { new: true }
    );

    if (!card) return res.status(404).send("Card was not found");
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("Error in put  specific card");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove({
      _id: req.params.id,
      user_id: req.payload._id,
    });

    if (!card) return res.status(404).send("Card was not found");
    res.status(201).send("Card was  deleted");
  } catch (error) {
    res.status(400).send("Error in delete specific card");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {}
});

module.exports = router;
