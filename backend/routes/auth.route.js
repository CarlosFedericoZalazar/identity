import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js"
import { register, login, getProfile } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);


export default router;