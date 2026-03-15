import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {superAdminMiddleware} from "../middlewares/superadmin.middleware.js";
import {deleteUser} from "../controllers/superadmin.controller.js";

const router = express.Router();

router.delete('/delete/:id', authMiddleware, superAdminMiddleware, deleteUser);
