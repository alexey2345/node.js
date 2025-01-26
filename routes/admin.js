const express = require("express");
const router = express.Router();
const { User } = require("../model/users");
const { Card } = require("../model/cards");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Delete a user by ID
router.delete("/users/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User not found.");
    res.send("User deleted successfully.");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Something went wrong.");
  }
});

// Delete a card by ID
router.delete("/cards/:id", [auth, admin], async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).send("Card not found.");
    res.send("Card deleted successfully.");
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).send("Something went wrong.");
  }
});

// Get all users (Admin access only)
router.get("/users", [auth, admin], async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// Get a specific user by ID
router.get("/users/:id", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch user by ID
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if the requesting user is the same as the target user or an admin
    if (req.user._id !== user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(user); // Return the user as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
