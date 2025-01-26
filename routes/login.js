// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/users");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  // Create JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  res.json({ token });
};

module.exports = { login };
