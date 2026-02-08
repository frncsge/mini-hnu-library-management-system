import express from "express";
import {
  authenticateUser,
  authenticateRole,
} from "../middlewares/auth.middleware.js";
import { getMyProfile, getBorrows } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/me", authenticateUser, getMyProfile);
router.get(
  "/api/me/borrows",
  authenticateUser,
  authenticateRole("student"),
  getBorrows,
);

export default router;
