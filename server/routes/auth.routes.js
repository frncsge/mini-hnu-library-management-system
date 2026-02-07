import express from "express";
import login from "../controllers/login.controller.js";
import verifyOtp from "../controllers/verifyOtp.controller.js";
import resendOtp from "../controllers/resendOtp.controller.js";
import { checkLoggedIn } from "../middlewares/auth.middleware.js";
import getNewAccessToken from "../controllers/refresh.controller.js";

const router = express.Router();

router.post("/login", checkLoggedIn, login);
router.post("/login/verify-otp", verifyOtp);
router.post("/login/resend-otp", checkLoggedIn, resendOtp);
router.post("/refresh", getNewAccessToken);

export default router;
