const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../model/users");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const router = express.Router();

router.post("/", async (req, res) => {
  // validate user's input
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid password");
    return;
  }

  // process
  const token = jwt.sign(
    { _id: user._id, biz: user.biz, isAdmin: user.isAdmin },
    config.jwtKey,
  );

  // response
  res.json({
    token,
  });
});

function validate(obj) {
  const schema = Joi.object({
    email: Joi.string().min(5).email().required(),
    password: Joi.string().min(7).max(20).required(),
  });

  return schema.validate(obj);
}

module.exports = router;
