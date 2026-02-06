import bcrypt from "bcrypt";
import redisClient from "../config/redis.config.js";
import { getUserByEmail } from "../models/user.model.js";
import generateSecureOTP from "../helpers/generateSecureOTP.helper.js";
import sendOTPbyEmail from "../helpers/mailer.helper.js";
import {
  cacheOtp,
  cacheOtpResendCooldown,
  trackOtpAttempts,
  resetOtpAttempts,
} from "../utils/authCache.util.js";

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Email and password are required" });

  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const otpDigit = 6;

  try {
    const user = await getUserByEmail(email);

    if (!user)
      return res.status(401).json({ message: "Incorrect email or password" });

    //if account found, check the password
    const match = await bcrypt.compare(password, user.hashed_password);

    if (!match)
      return res.status(401).json({ message: "Incorrect email or password" });

    //check if otp attempts reached maximum
    const { blocked, attempts, timeLeft } = await trackOtpAttempts(
      email,
      false, //set increment attempt to false
    );

    if (blocked) {
      return res.status(429).json({
        message: `You have reached the maximum ${attempts} OTP verification attempts. Please try again in ${timeLeft} seconds`,
      });
    }

    // if password match, check if an OTP is already sent
    const existingOTP = await redisClient.get(`otp:${email}`);
    if (existingOTP) {
      //if an OTP is alredy sent, check for an OTP resend cooldown
      const cooldown = await redisClient.ttl(`otpResendCooldown:${email}`);
      if (cooldown > 0)
        return res.status(429).json({
          message: `Please wait for ${cooldown} ${cooldown > 1 ? "seconds" : "second"} before requesting a new OTP`,
        });
    }

    //send otp via email
    const otp = generateSecureOTP(otpDigit);
    try {
      // await sendOTPbyEmail(email, otp);

      const value = { sub: user.user_id, role: user.user_role, otp };
      await cacheOtp(email, value);
      await cacheOtpResendCooldown(email);
      await resetOtpAttempts(email); //reset otp attempts for every new otp sent
    } catch (error) {
      console.error("Error sending OTP via email", error);
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try logging in again" });
    }

    res.status(200).json({ message: `OTP sent ${otp}` });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default login;
