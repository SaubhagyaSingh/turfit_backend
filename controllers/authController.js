const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

exports.signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user instance
    const user = new User({ fullName, email, password: hashPassword });
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password: inputPassword } = req.body; // Rename password here

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found with the given email" });
    }

    const isMatch = await bcrypt.compare(inputPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Rename destructured password variable to avoid conflict
    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
