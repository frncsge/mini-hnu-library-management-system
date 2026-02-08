import redisClient from "../config/redis.config.js";
import { clearJwtCookies } from "../utils/authCookies.util.js";

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    //delete refresh token from redis
    if (refreshToken) {
      await redisClient.del(`refreshToken:${refreshToken}`);
    }

    //then clear the access and refresh token cookies
    clearJwtCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default logout;
