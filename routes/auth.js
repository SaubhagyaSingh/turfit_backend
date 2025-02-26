const express = require("express");
const { signUp, signIn } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/api/signup", signUp);
authRouter.post("/api/signin", signIn);

module.exports = authRouter;
