import express from "express";
import {
  authenticateUser,
  authenticateRole,
} from "../middlewares/auth.middleware.js";
import { getMyProfile, getBorrows } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authenticateUser, getMyProfile);
router.get(
  "/me/borrows",
  authenticateUser,
  authenticateRole("student"),
  getBorrows,
);

export default router;
