import express from "express";
import { authMiddleware, isActiveMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { getUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", authMiddleware, isActiveMiddleware, adminMiddleware, getUsers);

export default router;