const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    middle: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 256,
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
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
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 1024, // Increased to accommodate hashed passwords
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
  biz: {
    type: Boolean,
    required: true,
  },
  isAdmin: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).optional().allow(""), // Allow empty string for optional fields
      last: Joi.string().min(2).max(256).required(),
    }).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(7).max(1024).required(), // Increased to accommodate hashed passwords
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
    biz: Joi.boolean().required(),
    isAdmin: Joi.boolean().required(),
  });

  const { error, value } = schema.validate(user);
  if (error) {
    console.error("Validation error:", error.details);
  }
  return { error, value };
}

module.exports = { User, validateUser };
