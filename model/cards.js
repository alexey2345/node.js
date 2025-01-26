const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  web: {
    type: String,
    required: true,
    minlength: 5,
  },
  image: {
    URL: {
      type: String,
      required: false,
      minlength: 14,
    },
    alt: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 256,
    },
  },
  address: {
    state: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 256,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    street: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    houseNumber: {
      type: Number,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  image: {
    URL: {
      type: String,
      required: true,
      minlength: 14,
    },
  },
  bizNumber: {
    type: Number,
    required: true,
    minlength: 1000,
    maxlength: 9_999_999_999,
    unique: true,
  },
  likes: {
    type: Array,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("Card", cardsSchema, "cards");

async function generateBizNumber() {
  while (true) {
    const random = _.random(100, 9_999_999_999);
    const card = await Card.findOne({ bizNumber: random });
    if (!card) {
      return random;
    }
  }
}

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(5).required(),
    web: Joi.string().min(5).required(),
    image: Joi.object({
      URL: Joi.string().min(14).optional().allow(""),
      alt: Joi.string().min(2).max(256).optional().allow(""),
    }).optional(),
    address: Joi.object({
      state: Joi.string().min(2).max(256).optional().allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number().required(),
    }),
  });

  return schema.validate(card);
}

module.exports = { Card, validateCard, generateBizNumber };
