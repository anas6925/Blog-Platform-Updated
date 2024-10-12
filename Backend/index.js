import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import signUpModel from "./routes/userCredentials.js";
import postBlogModel from "./routes/postBlogRoutes.js";

import authMiddleware from "./authMiddleware.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", false);

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "Failure",
      message: err.message,
    });
  }

  // Handle other known errors
  if (err.code === 11000) {
    return res.status(409).json({
      status: "Failure",
      message: "Duplicate key error.",
    });
  }

  // Catch-all for server errors
  return res.status(500).json({
    status: "Failure",
    message: "Internal Server Error",
  });
};

// MongoDB Connection with Error Handling
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample Route for Testing Error Handling
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes with Error Handling
app.use("/blogPost", signUpModel);
app.use("/blogPost", postBlogModel);

// Use the error handling middleware after routes
app.use(errorHandler);

// Export the app for testing
export default app; // <-- Add this line to export the app

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
