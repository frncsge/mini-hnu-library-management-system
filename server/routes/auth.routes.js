import express from "express";
import login from "../controllers/login.controller.js";
import verifyOtp from "../controllers/verifyOtp.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/login/verify-otp", verifyOtp);

export default router;
