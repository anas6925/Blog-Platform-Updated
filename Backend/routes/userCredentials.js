import express from "express";
import { signup, login } from "../controllers/userCredentials.js";
import {
  signupValidation,
  loginValidation,
} from "../validatiors/authValidator.js";

const router = express.Router();
router.post("/signupUser", signupValidation, signup);
router.post("/loginUser", loginValidation, login);

export default router;
