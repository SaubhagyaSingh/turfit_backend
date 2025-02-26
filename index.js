const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./routes/auth");

const app = express();
const PORT = 8080;
const DB = process.env.DB;

// Middleware
app.use(express.json());
app.use(authRouter);

// MongoDB Connection
mongoose
  .connect(DB)
  .then(() => {
    console.log(`MongoDB connected. Server running on port ${PORT}`);
    
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  }); 
