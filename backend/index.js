const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config"); // 🆕 import the MongoDB connection function
const bcrypt = require("bcrypt");

const {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} = require("./Schema");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB 🆕
connectDB();

// Routes
app.post("/SignUp", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserSchema({ ...req.body, password: hashedPassword });
    const resultUser = await user.save();
    res.status(201).json(resultUser);
  } catch {
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) return res.status(401).json({ message: "User doesn’t exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json(user);
});

// [All other routes remain unchanged below...]
