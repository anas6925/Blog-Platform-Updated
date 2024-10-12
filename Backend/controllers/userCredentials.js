import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userCredentials.js";
import { validationResult } from "express-validator";

// Signup controller
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorMessages,
      code: 400,
    });
  }

  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
        code: 400,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
        code: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const payload = { id: newUser._id, username: newUser.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { token },
      code: 201,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
      code: 500,
    });
  }
};

// Login controller
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorMessages,
      code: 400,
    });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email",
        code: 400,
      });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
        code: 400,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      data: { token },
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
      code: 500,
    });
  }
};
