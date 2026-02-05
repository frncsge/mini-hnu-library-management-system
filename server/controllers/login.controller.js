import bcrypt from "bcrypt";
import redisClient from "../config/redis.config.js";
import { getUserByEmail } from "../models/user.model.js";
import generateSecureOTP from "../helpers/generateSecureOTP.helper.js";
import sendOTPbyEmail from "../helpers/mailer.helper.js";

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

    // if password match, check if an OTP is already sent
    const existingOTP = await redisClient.get(`otp:${email}`);
    if (existingOTP)
      return res.status(429).json({
        message:
          "OTP already sent. Please wait 2 minutes before requesting a new one.",
      });

    //send otp via email
    const otp = generateSecureOTP(otpDigit);
    try {
      await sendOTPbyEmail(email, otp);
      await redisClient.setEx(`otp:${email}`, 2 * 60, otp);
    } catch (error) {
      console.error("Error sending OTP via email", error);
      return res.status(500).json({ message: "Failed to send OTP. Please try logging in again" });
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default login;
