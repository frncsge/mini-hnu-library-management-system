import express from "express";
import login from "../controllers/login.controller.js";
import verifyOtp from "../controllers/verifyOtp.controller.js";
import resendOtp from "../controllers/resendOtp.controller.js";
import { checkLoggedIn } from "../middlewares/auth.middleware.js";
import getNewAccessToken from "../controllers/refresh.controller.js";
import logout from "../controllers/logout.controller.js";
import register from "../controllers/registerStudent.controller.js";

const router = express.Router();

router.post("/api/login", login);
router.post("/api/login/verify-otp", verifyOtp);
router.post("/api/login/resend-otp", resendOtp);
router.post("/api/register", register);
router.post("/api/refresh", getNewAccessToken);
router.post("/api/logout", logout);

export default router;
