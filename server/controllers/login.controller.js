import bcrypt from "bcrypt";
import redisClient from "../config/redis.config.js";
import { getUserByEmail } from "../models/user.model.js";
import generateSecureOTP from "../helpers/generateSecureOTP.helper.js";
import sendOTPbyEmail from "../helpers/mailer.helper.js";
import {
  cacheOtp,
  cacheOtpSendCooldown,
  cachePendingLogin,
  resetOtpAttempts,
} from "../utils/authCache.util.js";

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Email and password are required" });

  const email = req.body.email.trim();
  const password = req.body.password.trim();

  try {
    //check if email fits the email pattern
    const emailPattern = /^[^\s@]+@hnu\.edu\.ph$/; //only login email from holy name university
    if (!emailPattern.test(email))
      return res
        .status(400)
        .json({ message: "Email must end with @hnu.edu.ph" });

    //then get the user by their email to check if their account exists
    const user = await getUserByEmail(email);
    if (!user)
      return res.status(401).json({ message: "Incorrect email or password" });

    //if user found, compare the password
    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match)
      return res.status(401).json({ message: "Incorrect email or password" });

    //check for an OTP send cooldown
    const cooldown = await redisClient.ttl(`otpSendCooldown:${email}`);
    if (cooldown > 0)
      return res.status(429).json({
        message: `Please wait for ${cooldown} ${cooldown > 1 ? "seconds" : "second"} before requesting a new OTP`,
      });

    //if all is good, send otp via email
    const otpDigit = 6;
    const otp = generateSecureOTP(otpDigit);
    try {
      await sendOTPbyEmail(email, otp);

      //cache otp in redis
      const value = { sub: user.user_id, role: user.user_role, otp };
      await cacheOtp(email, value);
      await cacheOtpSendCooldown(email);
      await resetOtpAttempts(email); //reset OTP verification attempts for new issued OTP

      //cache the user's email as pending login so they can request a new OTP without re-entering password
      await cachePendingLogin(email, value);
    } catch (error) {
      console.error("Error sending OTP via email", error);
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try logging in again" });
    }

    res.status(200).json({ message: `OTP sent` });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default login;
