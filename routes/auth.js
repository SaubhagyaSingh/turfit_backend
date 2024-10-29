const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

//Sign up api endpoint
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      var user = new User({ fullName, email, password: hashPassword });
      user = await user.save();
      res.json({ user });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Sign in api endpoint

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res
        .status(404)
        .json({ error: "user not found with the given Email" });
    } else {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      } else {
        //tokenization and removal of sensitive info
        const token = jwt.sign({ id: findUser._id }, "passwordKey");
        const { password, ...userWithoutPassword } = findUser._doc;
        res.json({ token, ...userWithoutPassword });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
