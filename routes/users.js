const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMW = require("../middleware/auth");

const { User, validateUser } = require("../model/users");

router.get("/me", authMW, async (req, res) => {
  res.json(await User.findById(req.user._id, { password: 0 }));
});

router.patch("/me/business", authMW, async (req, res) => {
  try {
    // Fetch the user by ID
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found.");

    // Toggle the business status
    user.biz = !user.biz;
    await user.save();

    // Send the updated user object
    res.json(_.pick(user, ["_id", "name", "phone", "email", "biz"]));
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).send("Error updating user status.");
  }
});

router.post("/", async (req, res) => {
  // Validate user input
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered");
  }

  // Create new user with picked fields
  user = new User(
    _.pick(req.body, [
      "name",
      "phone",
      "email",
      "password",
      "image",
      "address",
      "biz",
    ]),
  );

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  // Save user to database
  await user.save();

  // Combine user data and salt into a single response object
  res.json({
    ..._.pick(user, [
      "_id",
      "name",
      "phone",
      "email",
      "password",
      "image",
      "address",
      "biz",
      "likes",
      "createdAt",
    ]),
    salt: salt, // Include salt in response for demonstration purposes only
  });
});

//  Update user data (only their own)
router.put("/:id", authMW, async (req, res) => {
  const { id } = req.params;

  // Ensure user can only edit their own data
  if (req.user._id !== id) {
    return res
      .status(403)
      .send("Access denied. You can only update your own profile.");
  }

  // Optional: Validate updated fields (if you have a separate schema for updates)
  const updateFields = _.pick(req.body, [
    "name",
    "phone",
    "email",
    "password",
    "image",
    "address",
  ]);

  // If password is being updated, hash it
  if (updateFields.password) {
    const salt = await bcrypt.genSalt(12);
    updateFields.password = await bcrypt.hash(updateFields.password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.json(
      _.pick(updatedUser, [
        "_id",
        "name",
        "phone",
        "email",
        "image",
        "address",
        "biz",
        "likes",
        "createdAt",
      ]),
    );
  } catch (err) {
    res.status(500).send("Error updating user.");
  }
});

module.exports = router;
