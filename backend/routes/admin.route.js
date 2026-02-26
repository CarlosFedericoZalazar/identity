import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { getUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getUsers);

export default router;