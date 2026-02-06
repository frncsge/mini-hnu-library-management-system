import redisClient from "../config/redis.config.js";
import {
  getPendingLogin,
  cacheOtp,
  cacheOtpSendCooldown,
  resetOtpAttempts,
} from "../utils/authCache.util.js";
import generateSecureOTP from "../helpers/generateSecureOTP.helper.js";
import sendOTPbyEmail from "../helpers/mailer.helper.js";

const resendOtp = async (req, res) => {
  if (!req.body.email)
    return res.status(401).json({ message: "Email is required" });

  const { email } = req.body;

  try {
    //check if pending login exists
    const pending = await getPendingLogin(email);
    if (!pending) return res.status(401).json({ message: "Login is required" });
    const { sub, role } = JSON.parse(pending);

    //check for an OTP send cooldown
    const cooldown = await redisClient.ttl(`otpSendCooldown:${email}`);
    if (cooldown > 0)
      return res.status(429).json({
        message: `Please wait for ${cooldown} ${cooldown > 1 ? "seconds" : "second"} before requesting a new OTP`,
      });

    //send OTP to email
    const otpDigit = 6;
    const otp = generateSecureOTP(otpDigit);
    try {
    //   await sendOTPbyEmail(email, otp);

      //cache otp in redis
      const value = { sub, role, otp };
      await cacheOtp(email, value);
      await cacheOtpSendCooldown(email);
      await resetOtpAttempts(email); //reset OTP verification attempts for new issued OTP
    } catch (error) {
      console.error("Error sending OTP via email", error);
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try logging in again" });
    }

    res.status(200).json({ message: `OTP sent ${otp}` });
  } catch (error) {
    console.error("Error resending OTP", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default resendOtp;