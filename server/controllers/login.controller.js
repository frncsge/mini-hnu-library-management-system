import bcrypt from "bcrypt";
import redisClient from "../config/redis.config.js";
import { getUserByEmail } from "../models/user.model.js";
import generateSecureOTP from "../helpers/generateSecureOTP.helper.js";
import sendOTPbyEmail from "../helpers/mailer.helper.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  const otpDigit = 6;

  try {
    const user = await getUserByEmail(email);

    if (!user)
      return res.status(401).json({ message: "Incorrect email or password" });

    //if account found, check the password
    const match = await bcrypt.compare(password, user.hashed_password);

    if (!match)
      return res.status(401).json({ message: "Incorrect email or password" });

    //if password match, send OTP via email
    const otp = generateSecureOTP(otpDigit);
    try {
      await sendOTPbyEmail(email, otp);
      await redisClient.setEx(`otp:${email}`, 2 * 60, otp);
    } catch (error) {
      console.error("Error sending OTP via email", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent", email });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default login;
