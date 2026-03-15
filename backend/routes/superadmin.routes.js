import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { superAdminMiddleware } from "../middlewares/superAdmin.middleware.js";
import { deleteUser } from "../controllers/superAdmin.controller.js";

const router = express.Router();

// router.delete(
//   "/delete-user/:id",
//   authMiddleware,
//   superAdminMiddleware,
//   deleteUser
// );


router.delete(
  "/delete-user/:id",
  (req, res, next) => {
    console.log("ENTRA RUTA DELETE");
    next();
  },
  authMiddleware,
  superAdminMiddleware,
  deleteUser
);
export default router;