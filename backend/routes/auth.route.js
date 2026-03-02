import express from "express";
import {authMiddleware, isActiveMiddleware} from "../middlewares/authMiddleware.js"
import { register, login, getProfile, getMe } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.get("/me", authMiddleware, isActiveMiddleware, getMe);

export default router;