import redisClient from "../config/redis.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/jwt.helper.js";
import {
  cacheRefreshToken,
  trackOtpAttempts,
  deleteOtpFromCache,
  resetOtpAttempts,
  getPendingLogin,
  deletePendingLogin,
} from "../utils/authCache.util.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/authCookies.util.js";

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp) return res.status(401).json({ message: "OTP is required" });

  if (!email) return res.status(401).json({ message: "Email is required" });

  try {
    //check if pending login exists
    const pending = await getPendingLogin(email);
    if (!pending) return res.status(401).json({ message: "Login is required" });

    //get otp in redis
    const cache = await redisClient.get(`otp:${email}`);
    if (!cache) return res.status(403).json({ message: "Invalid OTP. Please request a new OTP and try again" });
    const { sub, role, otp: storedOtp } = JSON.parse(cache);

    //if invalid otp
    if (otp !== storedOtp) {
      //track otp verification attempt
      const { blocked, attempts, maxAttempts, timeLeft } =
        await trackOtpAttempts(
          email,
          true, //increment attempt
        );

      if (blocked) {
        await deleteOtpFromCache(email);
        return res.status(429).json({
          message: `You have reached the maximum ${attempts} OTP verification attempts. Please request a new OTP and try again`,
        });
      }

      const remainingAttempts = maxAttempts - attempts;
      return res.status(403).json({
        message: `Invalid OTP. Remaining ${remainingAttempts > 1 ? "attempts" : "attempt"}: ${remainingAttempts}`,
      });
    }

    //if otp match, generate access and refresh token
    const user = { sub, role };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await cacheRefreshToken(refreshToken, user);

    //pass access and refresh token cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    //delete otp cache and reset attempts
    await deleteOtpFromCache(email);
    await resetOtpAttempts(email);
    await deletePendingLogin(email);

    res.status(200).json({ message: "Login successful", role });
  } catch (error) {
    console.error("Error verifying OTP", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyOtp;
