import express from "express";
import { authMiddleware, isActiveMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { getUsers, createUser, resetPasswordUser, updateUser  } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", authMiddleware, isActiveMiddleware, adminMiddleware, getUsers);

router.post("/create-user", authMiddleware, isActiveMiddleware,adminMiddleware, createUser);

router.post("/reset-password/:id", authMiddleware, isActiveMiddleware, adminMiddleware, resetPasswordUser);

router.patch("/users/:id", authMiddleware, adminMiddleware, updateUser);

export default router;